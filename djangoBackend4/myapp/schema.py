import graphene
from graphene_django.types import DjangoObjectType
from .models import UserBioAndLink, FollowRequest


class UserBioLinkEdit(graphene.InputObjectType):
    newUsername = graphene.String(required=False)
    newBio = graphene.String(required=False)
    newLink = graphene.String(required=False)

class UserBioAndLinkType(DjangoObjectType):
    class Meta:
        model = UserBioAndLink

class FollowRequestType(DjangoObjectType):
    class Meta:
        model = FollowRequest
    

class Query(graphene.ObjectType):
    allUserBiosAndLinks = graphene.List(UserBioAndLinkType)
    allFollowRequests = graphene.List(FollowRequestType)
    userBioAndLinkForUser = graphene.Field(UserBioAndLinkType, username=graphene.String(required=True))
    followRequestsMadeByUser = graphene.List(graphene.String, username=graphene.String(required=True))
    followRequestsReceivedByUser = graphene.List(FollowRequestType, username=graphene.String(required=True))

    def resolve_allUserBiosAndLinks(root, info):
        return UserBioAndLink.objects.all()

    def resolve_allFollowRequests(root, info):
        return FollowRequest.objects.all()
    
    def resolve_userBioAndLinkForUser(root, info, username):
        try:
            userBioAndLink = UserBioAndLink.objects.get(username = username)
            return userBioAndLink
        except UserBioAndLink.DoesNotExist:
            return None
        
    def resolve_followRequestsMadeByUser(self, info, username):
        follow_requests = FollowRequest.objects.filter(requester=username).values_list('requestee', flat=True)
        return list(follow_requests)
    
    def resolve_followRequestsReceivedByUser(self, info, username):
        follow_requests = FollowRequest.objects.filter(requestee=username)
        return list(follow_requests)




class AddUserBioAndLink(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        bio = graphene.String(required=True)
        link = graphene.String(required=True)

    userBioAndLink = graphene.Field(UserBioAndLinkType)

    def mutate(self, info, username, bio, link):
        userBioAndLink = UserBioAndLink(username=username, bio=bio, link=link)
        userBioAndLink.save()
        return AddUserBioAndLink(userBioAndLink=userBioAndLink)


class AddFollowRequest(graphene.Mutation):
    class Arguments:
        requester = graphene.String(required=True)
        requestee = graphene.String(required=True)

    followRequest = graphene.Field(FollowRequestType)

    def mutate(self, info, requester, requestee):
        followRequest = FollowRequest(requester=requester, requestee=requestee)
        followRequest.save()
        return AddFollowRequest(followRequest=followRequest)


class RemoveUserBioAndLink(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    wasDeleteSuccessful = graphene.Boolean()

    def mutate(self, info, username):
        try:
            userBioAndLink = UserBioAndLink.objects.get(username = username)
            userBioAndLink.delete()
            return RemoveUserBioAndLink(wasDeleteSuccessful = True)
        except UserBioAndLink.DoesNotExist:
            return RemoveUserBioAndLink(wasDeleteSuccessful = False)
        

class RemoveFollowRequest(graphene.Mutation):
    class Arguments:
        requester = graphene.String(required=True)
        requestee = graphene.String(required=True)

    wasDeleteSuccessful = graphene.Boolean()

    def mutate(self, info, requester, requestee):
        try:
            follow_request = FollowRequest.objects.get(requester=requester, requestee=requestee)
            follow_request.delete()
            return RemoveFollowRequest(wasDeleteSuccessful=True)
        except FollowRequest.DoesNotExist:
            return RemoveFollowRequest(wasDeleteSuccessful=False)


class EditUserBioAndLink(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        data = UserBioLinkEdit(required=True)

    wasEditSuccessful = graphene.Boolean()

    def mutate(self, info, username, data):
        try:
            userBioAndLink = UserBioAndLink.objects.get(username = username)
            if data.newUsername is not None:
                userBioAndLink.username = data.newUsername
            if data.newBio is not None:
                userBioAndLink.bio = data.newBio
            if data.newLink is not None:
                userBioAndLink.link = data.newLink
            userBioAndLink.save()
            return EditUserBioAndLink(wasEditSuccessful = True)
        except:
            return EditUserBioAndLink(wasEditSuccessful = False)

class MarkUnreadFollowRequestsOfUserAsRead(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    wasOperationSuccessful = graphene.Boolean()

    def mutate(self, info, username):
        try:
            unreadFollowRequests = FollowRequest.objects.filter(requestee=username, isRead=False)

            for ufr in unreadFollowRequests:
                ufr.isRead = True
                ufr.save()

            return MarkUnreadFollowRequestsOfUserAsRead(wasOperationSuccessful=True)
        except Exception as e:
            return MarkUnreadFollowRequestsOfUserAsRead(wasOperationSuccessful=False)

        

class Mutation(graphene.ObjectType):
    addUserBioAndLink = AddUserBioAndLink.Field()
    addFollowRequest = AddFollowRequest.Field()
    removeUserBioAndLink = RemoveUserBioAndLink.Field()
    removeFollowRequest = RemoveFollowRequest.Field()
    editUserBioAndLink = EditUserBioAndLink.Field()
    markUnreadFollowRequestsOfUserAsRead = MarkUnreadFollowRequestsOfUserAsRead.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
