from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)



# make a env file and import all requirements
urlpatterns = [
    path('register/',views.RegisterView.as_view(), name='Register_account'),
    path('api/__email___verify__/', views.VerifyEmail, name='Verify_Email'),
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='Token_create'),
    path('api/token/new/', views.user_new_access_and_refrsh_token_and, name='Token_refresh_of_reflecting_acces_token'),
    path('api/access/refresh/', TokenRefreshView.as_view(), name='Get_access_if_page_refresh'),
    path('api/logout', views.logout, name='Logout'),
    path('api/dashboard/', views.get_data_of_user, name='Token_create'),
    path('api/_update_/password/', views.Update_pass, name='Update_password'),
    path('api/_update_/email/', views.Update_email, name='Update_email'),
    path('api/__email___update__/', views.Email_Update_confirm, name='Email_Update_confirm'),
    path('api/_send_mail_/_reset_pass_/', views.reset_pass_via_email, name='reset_pass_via_email'),
    path('api/______/_reset_pass_/', views.reset_pass, name='reset_pass_via_email'),

]