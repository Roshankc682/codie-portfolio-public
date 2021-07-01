import base64
import json
import io
from  first_app.models import Users
from django.http import HttpResponseRedirect

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from . import serializers
from .authentication import AUTH_HEADER_TYPES
from .exceptions import InvalidToken, TokenError
import socket
import requests
from distutils.command.config import config
from decouple import *

class TokenViewBase(generics.GenericAPIView):
    permission_classes = ()
    authentication_classes = ()

    serializer_class = None

    www_authenticate_realm = 'api'

    def get_authenticate_header(self, request):
        return '{0} realm="{1}"'.format(
            AUTH_HEADER_TYPES[0],
            self.www_authenticate_realm,
        )

    # =========================================================================
    def post(self, request, *args, **kwargs):

        try:
            if request.build_absolute_uri() == "http://api-v1-backend.herokuapp.com/api/access/refresh/" \
                    or \
                    request.build_absolute_uri() == "http://localhost:8000/api/access/refresh/"\
                    or \
                    request.build_absolute_uri() == "https://api-v1-backend.herokuapp.com/api/access/refresh/":
                pass
                # return Response({"details":"refresh the token","message": request.build_absolute_uri()}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # return Response({"details":"new token","message": request.build_absolute_uri()}, status=status.HTTP_400_BAD_REQUEST)
                if request.build_absolute_uri() == "http://api-v1-backend.herokuapp.com/api/token/" \
                        or \
                        request.build_absolute_uri() == "http://localhost:8000/api/token/"\
                        or \
                        request.build_absolute_uri() == "https://api-v1-backend.herokuapp.com/api/token/":
                    json_data = request.body
                    stream = io.BytesIO(json_data)
                    user_data_dic = JSONParser().parse(stream)
                    try:
                        if request.build_absolute_uri() == user_data_dic["url"]:
                            pass
                            try:
                                user_data_dic["recapcha"]
                                # ===========================================
                                secret = ""
                                url = f"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={user_data_dic['recapcha']}"
                                x = requests.post(url)
                                response_dict = json.loads(x.text)
                                # pass
                                if response_dict["success"] == True:
                                   pass
                                else:
                                    return Response({"message": "Invalid capcha"}, status=status.HTTP_400_BAD_REQUEST)
                                # ===========================================
                            except:
                                response = Response({"message": "recapcha not provided !!! "},
                                                    status=status.HTTP_400_BAD_REQUEST)
                                return response
                        else:
                            response = Response({"message": request.build_absolute_uri()}, status=status.HTTP_400_BAD_REQUEST)
                            return response
                    except:
                        response = Response({"message": "Url not provided !!!"}, status=status.HTTP_400_BAD_REQUEST)
                        return response
                else:
                    response = Response({"message": "Url not provided !!!"}, status=status.HTTP_400_BAD_REQUEST)
                    return response
        except:
            response = Response({"message": "Something went wrong !!! "}, status=status.HTTP_400_BAD_REQUEST)
            return response
        try:
            if request.COOKIES:
                # response = Response({"token_from_cookie": request.COOKIES.get('refresh')}, status=status.HTTP_400_BAD_REQUEST)
                # return response
                token = request.COOKIES.get('refresh')
                splitted_token = token.split(".")
                second_base64_string = splitted_token[1]
                second_base64_string_bytes = second_base64_string.encode('ascii')
                jwt_bytes = base64.b64decode(second_base64_string_bytes + b'=' * (-len(second_base64_string_bytes) % 4))
                jwt_decoded = jwt_bytes.decode('ascii')
                jwt_decoded = json.loads(jwt_decoded)
                exp = jwt_decoded["exp"]
                import time
                time_expired_check = exp - time.time()
                if time_expired_check <= 0:
                    request.COOKIES.clear()
                else:
                   try:
                       # if some tries to login giving refresh in cookie this will solve
                       if user_data_dic["email"] and user_data_dic["password"]:
                           # ===============================================================
                           # activate or not emil check
                           Entry = Users.objects.filter(email=user_data_dic["email"]).values('verified')
                           for course in Entry:
                               if (course['verified']) == "1":
                                   response = Response({"detail": "Activate your account !!! "},
                                                       status=status.HTTP_400_BAD_REQUEST)
                                   return response
                           # ===============================================================
                           request.COOKIES.clear()
                       else:
                           response = Response({"message": "Illigel thing !!!! "}, status=status.HTTP_400_BAD_REQUEST)
                           return response
                   except:
                       pass
            else:
                pass
        except:
            response = Response({"message": "11Login Error !!!"}, status=status.HTTP_400_BAD_REQUEST)
            return response
        # ===============================================================
        # activate or not emil check
        try:
            json_data = request.body
            stream = io.BytesIO(json_data)
            _check_email_ = JSONParser().parse(stream)
            if _check_email_:
                _Entry_ = Users.objects.filter(email=_check_email_["email"]).values('verified')
                for course in _Entry_:
                    if (course['verified']) == "1":
                        response = Response({"detail": "Activate your account !!! "},
                                    status=status.HTTP_400_BAD_REQUEST)
                        return response
        except:
            pass
        # ===============================================================
        # response = Response({"detail": "........Checking ....."}, status=status.HTTP_400_BAD_REQUEST)
        # return response
        if request.COOKIES.get('refresh'):
            serializer = self.get_serializer(data={"refresh": request.COOKIES.get('refresh')})
        else:
            serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        if request.COOKIES.get('refresh'):
            response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            try:
                refresh = serializer.validated_data.pop("refresh")
                response = Response(serializer.validated_data, status=status.HTTP_200_OK)
                response.set_cookie('refresh', refresh, samesite="none", secure=True, httponly=True)
            except:
                response = Response({"message": "Refresh token should be send from cookie"}, status=status.HTTP_200_OK)
        return response
    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #
    #     try:
    #         serializer.is_valid(raise_exception=True)
    #     except TokenError as e:
    #         raise InvalidToken(e.args[0])
    #
    #     return Response(serializer.validated_data, status=status.HTTP_200_OK)


class TokenObtainPairView(TokenViewBase):
    """
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    """
    serializer_class = serializers.TokenObtainPairSerializer


token_obtain_pair = TokenObtainPairView.as_view()


class TokenRefreshView(TokenViewBase):
    """
    Takes a refresh type JSON web token and returns an access type JSON web
    token if the refresh token is valid.
    """
    serializer_class = serializers.TokenRefreshSerializer


token_refresh = TokenRefreshView.as_view()


class TokenObtainSlidingView(TokenViewBase):
    """
    Takes a set of user credentials and returns a sliding JSON web token to
    prove the authentication of those credentials.
    """
    serializer_class = serializers.TokenObtainSlidingSerializer


token_obtain_sliding = TokenObtainSlidingView.as_view()


class TokenRefreshSlidingView(TokenViewBase):
    """
    Takes a sliding JSON web token and returns a new, refreshed version if the
    token's refresh period has not expired.
    """
    serializer_class = serializers.TokenRefreshSlidingSerializer


token_refresh_sliding = TokenRefreshSlidingView.as_view()


class TokenVerifyView(TokenViewBase):
    """
    Takes a token and indicates if it is valid.  This view provides no
    information about a token's fitness for a particular use.
    """
    serializer_class = serializers.TokenVerifySerializer


token_verify = TokenVerifyView.as_view()
