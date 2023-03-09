import UserForm from "../UserForm/UserForm";

// class for comment system
export default class CommentSystem {
  private DATA: string | null;
  private numberComments: number;

  protected userForm: UserForm;

  constructor() {
    // data initialization
    if (!localStorage.getItem("DATA")) {
      this.DATA = "{\"user\": {}, \"history\": []}";
      localStorage.setItem("DATA", this.DATA);
    } else {
      this.DATA = localStorage.getItem("DATA");
    }

    this.numberComments = 0;

    this.userForm = new UserForm();
  }

  // user block hiding method
  protected userBlockHidden(boolean: boolean): void {
    const userBlock: HTMLElement | null = document.querySelector(".comment-system__user-field");
    if (boolean) {
      if (userBlock) userBlock.style.display = "none";
    } else {
      if (userBlock) userBlock.style.display = "flex";
    }
  }

  public createUser(nickname: string, avatar: string): void {
    const userAvatar: HTMLElement | null = document.querySelector(".user-field__avatar-img");
    const userNickname: HTMLElement | null = document.querySelector(".user-field__nickname");
    if (userAvatar !== null) userAvatar.setAttribute("src", avatar);
    if (userNickname !== null) userNickname.innerHTML = nickname;

    const data = this.getDATA();

    data.user = {
      userNickname: nickname,
      userAvatar: avatar,
      favorites: data.user.favorites === undefined || Object.keys(data.user.favorites).length === 0 ? {} : data.user.favorites
    };

    localStorage.setItem("DATA", JSON.stringify(data));

  }

  protected getUserNickname() {
    const userNicknameElement: HTMLElement | null = document.querySelector(".user-field__nickname");
    if (userNicknameElement) {
      const userNickname = userNicknameElement.innerHTML;
      return userNickname;
    }
  }

  protected getUserAvatar() {
    const userAvatarElement: HTMLElement | null = document.querySelector(".user-field__avatar-img");
    if (userAvatarElement !== null) {
      const userAvatar = userAvatarElement.getAttribute("src");
      return userAvatar;
    }
  }

  // method for getting data from history
  protected getDATA(): any {
    const currentData: string | null = localStorage.getItem("DATA");
    if (currentData) {
      const parseDATA = JSON.parse(currentData);
      if (Object.keys(parseDATA).includes("history")) {
        return parseDATA;
      }
    }
  }

  // method to get current date
  protected getCurrentDate(): any {
    const date = new Date();

    const fullDate = new Date(
      Date.UTC(date.getUTCFullYear(), 
        date.getMonth(), 
        date.getDate(), 
        date.getHours(), 
        date.getMinutes(), 
        date.getSeconds()
      ));

    const displayDate = `${date.getDate()}.${date.getMonth()}  ${date.getHours()}:${date.getMinutes()}`;
    return {
      fullDate: fullDate,
      displayDate: displayDate
    };
  }

  // adding comment block to history
  protected addHistoryComments(commentBlock: object): void {
    const currentData = this.getDATA();
    currentData.history.push(commentBlock);
    localStorage.setItem("DATA", JSON.stringify(currentData));
  }

  // reply history update method
  protected updateHistoryReply(commentID: number | undefined, replyID: number, replyBlock: object) {
    const currentData = this.getDATA();
    currentData.history.forEach((commentBlock: any) => {
      if (+commentBlock.commentID === commentID) {
        commentBlock.replies[`reply_${replyID}`] = replyBlock;
      }
    });
    localStorage.setItem("DATA", JSON.stringify(currentData));
  }

  protected updateNumberComments(): void {
    const numberCommentsElement = document.querySelector(".comment-system__count");
    this.numberComments = this.getNumberComments();

    if (numberCommentsElement) numberCommentsElement.innerHTML = `(${this.numberComments})`;
  }

  protected getNumberComments(): number {
    return Object.keys(this.getDATA().history).length;
  }
}