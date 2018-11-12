class Ability
  include CanCan::Ability
  attr_accessor :user

  def initialize(current_user)
    alias_action :create, :read, :update, :destroy, :to => :crud
    alias_action :read, :update, :to => :modify

    guest_permissions # applies to non logged in user

    self.user = current_user # set scope of user to logged in user
    return if user.nil?

    default_permissions # applies to all logged in users

  end

  def guest_permissions
    can :create, User # can register
    can :read, Article
  end

  def default_permissions
    cannot :manage, :all # wipe all base Permissions
    can [:crud, :edit_password], User, { id: user.id } # can crud self
    can :read, User # can view other users in list or individual
    can :crud, Comment, { user_id: user.id } # can crud own comments
    can :read, Comment # can view other user's comments in list or individual
    can :crud, Vote, { user_id: user.id } # can crud own votes
    can :read, Vote # can view other user's votes in list or individual
    can :crud, Following, { follower_id: user.id } # can follower other users
    can :crud, Blocking, { blocker_id: user.id } # can block other users
  end
end
