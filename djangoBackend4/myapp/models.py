from django.db import models

class UserBioAndLink(models.Model):
    username = models.CharField(max_length=30, unique=True, db_index=True, primary_key=True)
    bio = models.CharField(max_length=250)
    link = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        db_table = 'userBiosAndLinks'

    def __str__(self):
        return self.username

class FollowRequest(models.Model):
    id = models.AutoField(primary_key=True)
    requester = models.CharField(max_length=30)
    requestee = models.CharField(max_length=30)

    class Meta:
        db_table = 'followRequests'
        unique_together = (('requester', 'requestee'),)
        

    def __str__(self):
        return f"{self.requester.username} is requesting {self.requestee.username}"
