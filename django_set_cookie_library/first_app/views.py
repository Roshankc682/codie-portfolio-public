from django.contrib.auth.hashers import make_password
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

import django_set_cookie_library
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import *
from .models import *
from .serializers import UserSerializer, MyTokenObtainPairSerializer, Obtain_Refresh_And_Access

from django_set_cookie_library.settings import EMAIL_HOST_USER
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from first_app.models import Users
from email_validator import validate_email , EmailNotValidError

@csrf_exempt
@api_view(['POST'])
def VerifyEmail(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)

        Entry = Users.objects.filter(token=user_data_dic["token"]).values('email')
        for course in Entry:
            _email_to_verified_ = course['email']
        Users.objects.filter(token=user_data_dic["token"]).update(verified='0')
        Users.objects.filter(email=_email_to_verified_).update(token='test_token')
        return Response({"message": " Email Verified now you can login in Peace ", "email": _email_to_verified_},
                        status=status.HTTP_200_OK)
    except:
        return Response({"message": "!!! Provide a valid token !!!"},
                        status=status.HTTP_400_BAD_REQUEST)

# Email_Update_confirm
@csrf_exempt
@api_view(['POST'])
def Email_Update_confirm(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        Entry = Users.objects.filter(update_mail_token=user_data_dic["token"]).values('id','update_email_temp')
        for course in Entry:
            _id_ = course['id']
            _change_email_ = course['update_email_temp']
        Users.objects.filter(id=_id_).update(email=_change_email_)
        Users.objects.filter(id=_id_).update(update_mail_token='test_token')
        return Response({"message": " Email Verified now you can login in Peace "},status=status.HTTP_200_OK)
    except:
        return Response({"message": "!!! Provide a valid token !!!"},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Update_pass(request):
    try:
        # print(request.user.id)
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        hashed_pwd = make_password(user_data_dic["pass"])
        Users.objects.filter(id=request.user.id).update(password=hashed_pwd)
        return Response({"message": "Password Changed "}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "!!! Provide a valid token !!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Update_email(request):
    try:
        # print(request.user.id)
        mainURL = "http://localhost:3000/_update_verfiy_email?token="
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        new_email = user_data_dic["email"]
        try:
            if len(user_data_dic["recapcha"]) == 0:
                return Response({"message": "Recapcha invalid"}, status=status.HTTP_400_BAD_REQUEST)
            # secret = config('secret')
            secret = ""
            url = f"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={user_data_dic['recapcha']}"
            x = requests.post(url)
            response_dict = json.loads(x.text)
            if response_dict["success"] == True:
                pass
            else:
                return Response({"message": "Invalid capcha"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "Recapcha Not provided !!! "},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            valid = validate_email(new_email)
        except EmailNotValidError as e:
            print(str(e))
            return Response({"message": "Provide a valid email "}, status=status.HTTP_400_BAD_REQUEST)
        _check_mail_exits_ = Users.objects.filter(email=user_data_dic["email"]).values('email')
        for course in _check_mail_exits_:
            if (course['email']):
                return Response({"Error": "Email", "message": "You cannot use this email"},status=status.HTTP_400_BAD_REQUEST)
        import secrets
        verify_email = secrets.token_hex(20)
        Users.objects.filter(id=request.user.id).update(update_mail_token=verify_email)
        Users.objects.filter(id=request.user.id).update(update_email_temp=new_email)
        # ====send email=============================
        subject = f'Update email to {user_data_dic["email"]}'
        from_email = 'Codie-Bruh'
        to = user_data_dic["email"]
        text_content = '!!! Update of E=-mail !!! '
        message = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'><style>.signup_button {box-shadow: -2px 4px 14px -3px #3dc21b;background-color:#9dec7459;border-radius:36px;border:5px solid #050605;display:inline-block;curso:pointer;color:#ffffff;font-family:Verdana;font-size:26px;font-weight:bold;font-style:italic;padding:11px 33px;text-decoration:none;text-shadow:-1px -4px 3px #2f6627;}.signup_button:hover {background-color:#cab0d8;}.signup_button:active {position:relative;top:1px;}</style></head><body><center><div><h2>Verify   " + str(
            user_data_dic["email"]) + ": </h2><a href='" + mainURL + verify_email + "&type=update" +"' class='signup_button'>By clicking you will update email</a><br><h4 style='color: red;'>Don't share this link to any third party and it will expire in 24 hrs or after you click this link</h4><div></center></body></html>"
        html_content = message
        message = EmailMultiAlternatives(subject, text_content, from_email, [to])
        message.attach_alternative(html_content, "text/html")
        message.send()
        return Response({"message": "Check mail to verify account"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "!!! Something went wrong !!!"}, status=status.HTTP_400_BAD_REQUEST)


# Register class
class RegisterView(GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            mainURL = "http://localhost:3000/verfiy_email?token="
            json_data = request.body
            stream = io.BytesIO(json_data)
            user_data_dic = JSONParser().parse(stream)
            if len(user_data_dic["recapcha"]) == 0:
                return Response({"message": "Recapcha invalid"}, status=status.HTTP_400_BAD_REQUEST)
            # secret = config('secret')
            secret = ""
            url = f"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={user_data_dic['recapcha']}"
            x = requests.post(url)
            response_dict = json.loads(x.text)
            if response_dict["success"] == True:
                pass
            else:
                return Response({"message": "Invalid capcha"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "Recapcha Not provided !!! "},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            len_pass = len(user_data_dic["password"])
            len_name = len(user_data_dic["password"])
            len_first = len(user_data_dic["first_name"])
            len_last = len(user_data_dic["last_name"])
            try:
                valid = validate_email(user_data_dic["email"])
                email = valid.email
            except EmailNotValidError as e:
                # print(str(e))
                return Response({"message": "Provide a valid email "}, status=status.HTTP_400_BAD_REQUEST)
            if len_pass <= 5:
                return Response({"message": "Password must be at least 5 character !!! "},
                                status=status.HTTP_400_BAD_REQUEST)
            if len_name <= 5:
                return Response({"message": "Name must be at least 5 character !!! "},
                                status=status.HTTP_400_BAD_REQUEST)
            if len_first <= 2:
                return Response({"message": "First name must be at least 2 character !!! "},
                                status=status.HTTP_400_BAD_REQUEST)
            if len_last <= 2:
                return Response({"message": "Last name must be at least 2 character !!! "},
                                status=status.HTTP_400_BAD_REQUEST)

        except:
            pass

        # json_data = request.body
        # stream = io.BytesIO(json_data)
        # user_data_dic = JSONParser().parse(stream)
        user_data_dic['update_mail_token'] = "test_token"
        user_data_dic['token_password_reset'] = "test_token"
        user_data_dic['update_email_temp'] = "null"
        try:
            import uuid
            uuid = uuid.uuid4()

            user_data_dic['username'] = user_data_dic.get('first_name');
            user_data_dic['id'] = str(uuid);
            if Users.objects.get(id=str(uuid)):
                return Response({"message": "Internal Error !!! Try again"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            pass
        import secrets
        user_data_dic['token'] = secrets.token_hex(20)
        user_data_dic['verified'] = "1"
        serializer = UserSerializer(data=user_data_dic)

        try:
            # check email activated or not if not then mail it again if register
            if Users.objects.get(email=user_data_dic.get('email')):
                # check email varified if not then again email
                # ====================================================================
                _check_mail_verified_ = Users.objects.filter(email=user_data_dic["email"]).values('verified')
                for course in _check_mail_verified_:
                    if (course['verified']) == "1":
                        import secrets
                        token_updated = secrets.token_hex(20)
                        Users.objects.filter(email=user_data_dic["email"]).update(token=token_updated)
                        hashed_pwd = make_password(user_data_dic["password"])
                        Users.objects.filter(email=user_data_dic["email"]).update(password=hashed_pwd,username=user_data_dic.get('username'),first_name=user_data_dic.get('first_name'),last_name=user_data_dic.get('last_name'))
                        subject = f'Conformation of {user_data_dic["email"]}'
                        from_email = 'Codie-Bruh'
                        to = user_data_dic["email"]
                        text_content = '!!! Verify Your E-Mail Before Login !!! '
                        message = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'><style>.signup_button {box-shadow: -2px 4px 14px -3px #3dc21b;background-color:#9dec7459;border-radius:36px;border:5px solid #050605;display:inline-block;curso:pointer;color:#ffffff;font-family:Verdana;font-size:26px;font-weight:bold;font-style:italic;padding:11px 33px;text-decoration:none;text-shadow:-1px -4px 3px #2f6627;}.signup_button:hover {background-color:#cab0d8;}.signup_button:active {position:relative;top:1px;}</style></head><body><center><div><h2>To create account for  " + str(
                            user_data_dic[
                                "email"]) + ": </h2><a href='" + mainURL + token_updated + "' class='signup_button'>Click here to create account</a><br><h4 style='color: red;'>Don't share this link to any third party and it will expire in 24 hrs or after you click this link</h4><div></center></body></html>"
                        html_content = message

                        message = EmailMultiAlternatives(subject, text_content, from_email, [to])
                        message.attach_alternative(html_content, "text/html")
                        message.send()
                        return Response({
                            "message": "Register successfully",
                            "email": user_data_dic.get('email'),
                            "username": user_data_dic.get('username'),
                            "first_name": user_data_dic.get('first_name'),
                            "last_name": user_data_dic.get('last_name'),
                            "id": user_data_dic.get('id')
                        }, status=status.HTTP_201_CREATED)
                    if (course['verified']) == "0":
                        return Response({"Error": "Email", "message": "Email Already registered"},
                                        status=status.HTTP_400_BAD_REQUEST)
            # ====================================================================
        except:
            # if newly register then just pass no offense
            pass
        if serializer.is_valid():
            serializer.save()
            subject = f'Conformation of {user_data_dic["email"]}'
            from_email = 'Codie-Bruh'
            to = user_data_dic["email"]
            text_content = '!!! Verify Your E-Mail Before Login !!! '

            message = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'><style>.signup_button {box-shadow: -2px 4px 14px -3px #3dc21b;background-color:#9dec7459;border-radius:36px;border:5px solid #050605;display:inline-block;curso:pointer;color:#ffffff;font-family:Verdana;font-size:26px;font-weight:bold;font-style:italic;padding:11px 33px;text-decoration:none;text-shadow:-1px -4px 3px #2f6627;}.signup_button:hover {background-color:#cab0d8;}.signup_button:active {position:relative;top:1px;}</style></head><body><center><div><h2>To create account for  " + str(
                user_data_dic["email"]) + ": </h2><a href='" + mainURL + user_data_dic[
                          'token'] + "' class='signup_button'>Click here to create account</a><br><h4 style='color: red;'>Don't share this link to any third party and it will expire in 24 hrs or after you click this link</h4><div></center></body></html>"
            html_content = message

            message = EmailMultiAlternatives(subject, text_content, from_email, [to])
            message.attach_alternative(html_content, "text/html")
            message.send()
            return Response({
                "message": "Register successfully",
                "email": user_data_dic.get('email'),
                "username": user_data_dic.get('username'),
                "first_name": user_data_dic.get('first_name'),
                "last_name": user_data_dic.get('last_name'),
                "id": user_data_dic.get('id')
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# login class
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data_of_user(request):
    try:
        return Response({"message": "welcome to dashboard"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "credentials not provided !!"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def logout(request):
    token = RefreshToken(request.COOKIES.get('refresh'))
    token.blacklist()
    response = Response({"message": "You are logout"}, status=status.HTTP_200_OK)
    response.delete_cookie('refresh')
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_new_access_and_refrsh_token_and(request):
    try:
        if request.COOKIES.get('refresh'):
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
                return Response({"message": "Refresh token Expired"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                pass
            if jwt_decoded["token_type"] != "refresh":
                return Response({"message": "Not valid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                pass
            if jwt_decoded["user_id"] == request.user.id:
                pass
            else:
                return Response({"message": "user id doesn't match !!! "}, status=status.HTTP_400_BAD_REQUEST)
            user = Users.objects.get(id=request.user.id)
            refresh = Obtain_Refresh_And_Access.get_token(user)
            response = Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)
            response.set_cookie('refresh', refresh, samesite="none", secure=True, httponly=True)
            return response
        else:
            response = Response({"message": "Refresh token missing !! "}, status=status.HTTP_400_BAD_REQUEST)
            return response
    except:
        response = Response({"message": "Something went wrong !! "}, status=status.HTTP_400_BAD_REQUEST)
        return response


@csrf_exempt
@api_view(['POST'])
def reset_pass_via_email(request):
    try:
        mainURL = "http://localhost:3000/_update_pass_?token="
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)

        try:
            if len(user_data_dic["recapcha"]) == 0:
                return Response({"message": "Recapcha invalid"}, status=status.HTTP_400_BAD_REQUEST)
            # secret = config('secret')
            secret = ""
            url = f"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={user_data_dic['recapcha']}"
            x = requests.post(url)
            response_dict = json.loads(x.text)
            if response_dict["success"] == True:
                pass
            else:
                return Response({"message": "Invalid capcha"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "Recapcha Not provided !!! "},
                            status=status.HTTP_400_BAD_REQUEST)


        try:
            valid = validate_email(user_data_dic["email"])
            email = valid.email
        except EmailNotValidError as e:
            return Response({"message": "Provide a valid email "}, status=status.HTTP_400_BAD_REQUEST)

        _email_check_ = Users.objects.filter(email=user_data_dic["email"])
        if not _email_check_.exists():
            return Response({"message": "If Email exists we sent you a mail "},status=status.HTTP_200_OK)

        Entry = Users.objects.filter(email=user_data_dic["email"]).values('verified')
        for course in Entry:
            if (course['verified']) == "1":
                return Response({"message": "If Email exists we sent you a mail "},status=status.HTTP_200_OK)
                return response

        import secrets
        token_updated = secrets.token_hex(20)
        Users.objects.filter(email=user_data_dic["email"]).update(token_password_reset=token_updated)
        subject = f'Password reset of {user_data_dic["email"]}'
        from_email = 'Codie-Bruh'
        to = user_data_dic["email"]
        text_content = '!!! Reset Password !!! '
        message = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'><style>.signup_button {box-shadow: -2px 4px 14px -3px #3dc21b;background-color:#9dec7459;border-radius:36px;border:5px solid #050605;display:inline-block;curso:pointer;color:#ffffff;font-family:Verdana;font-size:26px;font-weight:bold;font-style:italic;padding:11px 33px;text-decoration:none;text-shadow:-1px -4px 3px #2f6627;}.signup_button:hover {background-color:#cab0d8;}.signup_button:active {position:relative;top:1px;}</style></head><body><center><div><h3>Some one claim to reset password if it's not you then do nothing</h3><p>Reset Password of  " + str(
            user_data_dic[
                "email"]) + ": </p><a href='" + mainURL + token_updated + "&type=reset" +"' class='signup_button'>Click here to reset password</a><br><h4 style='color: red;'>Don't share this link to any third party and it will expire in 24 hrs or after you click this link</h4><div></center></body></html>"
        html_content = message

        message = EmailMultiAlternatives(subject, text_content, from_email, [to])
        message.attach_alternative(html_content, "text/html")
        message.send()
        return Response({"message": "If Email exists we sent you a mail ", "email": user_data_dic["email"]},status=status.HTTP_200_OK)
    except:
        return Response({"message": "!!! Something went wrong !!!"},status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
@api_view(['POST'])
def reset_pass(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        len_pass = len(user_data_dic["password"])
        len_password_confirm = len(user_data_dic["password_confirm"])
        if len_pass <= 5:
            return Response({"message": "Password must be at least 5 character !!! "},status=status.HTTP_400_BAD_REQUEST)
        if len_password_confirm <= 5:
            return Response({"message": "Password must be at least 5 character !!! "},status=status.HTTP_400_BAD_REQUEST)

        if user_data_dic["password"] == user_data_dic["password_confirm"]:
            pass
        else:
            return Response({"message": "New and confirm password must match !!"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            _check_mail_exits_ = Users.objects.filter(token_password_reset=user_data_dic["token_reset"]).values('token_password_reset')
            for course in _check_mail_exits_:
                if (course['token_password_reset']):
                    hashed_pwd = make_password(user_data_dic["password"])
                    Users.objects.filter(token_password_reset=user_data_dic["token_reset"]).update(password=hashed_pwd)
                    Users.objects.filter(token_password_reset=user_data_dic["token_reset"]).update(token_password_reset='test_token')
                    return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
            return Response({"message": "!!! Provide a valid token !!!"}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({"message": "!!! Provide a valid token !!!"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "!!! Provide a valid token !!!"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "!!! Provide a valid token !!!"},status=status.HTTP_400_BAD_REQUEST)