class UserDTO {
  static Default(userModel) {
    return {
      email: userModel.email,
      id: userModel._id,
      usergroup: userModel.usergroup,
    };
  }
}

module.exports = UserDTO;
