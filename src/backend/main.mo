
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply data migration module via with clause

actor {
  // Add authentication and file storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type NFTItem = {
    id : Nat;
    title : Text;
    image : Storage.ExternalBlob;
  };

  type Profile = {
    name : Text;
    bio : Text;
    website : Text;
    twitter : Text;
    instagram : Text;
  };

  public type UserProfile = {
    name : Text;
    bio : Text;
    website : Text;
    twitter : Text;
    instagram : Text;
  };

  let profile : Profile = {
    name = "NEWBOY";
    bio = "Digital artist & NFT creator";
    website = "https://newboy.art";
    twitter = "https://twitter.com/newboyartist";
    instagram = "https://instagram.com/newboy.art";
  };

  // NFT store
  let nftItems = Map.empty<Nat, NFTItem>();
  var nftIdCounter = 0;

  // User profiles store
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Brand profile query - public, no auth needed
  public query ({ caller }) func getProfile() : async Profile {
    profile;
  };

  // User profile queries - require authentication
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // NFT gallery queries - public, no auth needed
  public query ({ caller }) func getAllNFTItems() : async [NFTItem] {
    nftItems.values().toArray();
  };

  // NFT gallery mutations - admin only
  public shared ({ caller }) func addNFTItem(title : Text, blob : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let newItem : NFTItem = {
      id = nftIdCounter;
      title;
      image = blob;
    };
    nftItems.add(nftIdCounter, newItem);
    nftIdCounter += 1;
    nftIdCounter - 1;
  };

  public shared ({ caller }) func deleteNFTItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not nftItems.containsKey(id)) {
      Runtime.trap("NFT not found");
    };
    nftItems.remove(id);
  };
};
