class UserResponseDto {
  constructor(userInfo) {
    this.name = userInfo.first_name;
    this.lastname = userInfo.last_name;
    this.email = userInfo.email;
    this.age = userInfo.age;
    this.role = userInfo.role;
    this.cartId = userInfo.cartId;
  }
}

export { UserResponseDto };
