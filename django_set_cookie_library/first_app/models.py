from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class customer_manager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, id, token, verified ,update_email_temp,update_mail_token, token_password_reset, password=None):
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            id=id,
            token=token,
            verified=verified,
            update_email_temp = update_email_temp,
            update_mail_token = update_mail_token,
            token_password_reset = token_password_reset,
        )
        user.set_password(password)
        user.save(using=self._db)
        return email


# auth.user model will be override from setting --> see settings file to override
class Users(AbstractBaseUser):
    id = models.CharField(primary_key=True, editable=False, max_length=70)
    email = models.EmailField(max_length=60, unique=True)
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=128)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_active = models.BooleanField(default=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    image_url = models.CharField(max_length=60, default="profile.png")
    token = models.CharField(max_length=1000)
    token_password_reset = models.CharField(max_length=1000)
    verified = models.CharField(max_length=10)
    update_mail_token = models.CharField(max_length=1000)
    update_email_temp = models.CharField(max_length=100)


    class Meta:
        db_table = "registered_user"

    # To login this field is required (email)
    USERNAME_FIELD = 'email'
    # this is required fields
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'id', 'token', 'verified','update_mail_token','update_email_temp','token_password_reset']
    objects = customer_manager()

    # This will return the email in template file
    def __str__(self):
        return self.email

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(self, app_label):
        return True
