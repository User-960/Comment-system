// text field class with user button
export default class UserForm {
  public textarea: HTMLInputElement | null;
  private charWarning: HTMLElement | null;
  public sendBtn: HTMLElement | null;

  private maxChar: number;

  private autosize;
  private checkQuantityChar;

  constructor() {
    this.textarea = document.querySelector(".user-field__textarea");
    this.charWarning = document.querySelector(".user-field__maxchar-warning");
    this.sendBtn = document.querySelector(".user-field__btn");

    this.maxChar = 1000;

    // callback function to dynamically change the height of the text field depending on the number of lines of text
    this.autosize = (): void => {
      if (this.textarea !== null) {
        this.textarea.style.height = "0px";
        this.textarea.style.height = this.textarea.scrollHeight + "px";
      }
    };

    // callback function to check the number of entered characters
    this.checkQuantityChar = (): void => {
      const maxCharElement = document.querySelector(".user-field__maxchar");
      if (this.textarea !== null && this.sendBtn !== null && this.charWarning !== null && maxCharElement !== null) {
        const valueTextarea: string = this.textarea.value;

        if (+valueTextarea.length === 0) {
          this.sendBtn.classList.add("user-field__btn--disable");
          maxCharElement.innerHTML = `Max ${this.maxChar} symbols`;
        } else if (+valueTextarea.length > 0) {
          this.sendBtn.classList.remove("user-field__btn--disable");
          maxCharElement.innerHTML = `${+valueTextarea.length}/${this.maxChar}`;
        }

        if (+valueTextarea.length >= this.maxChar) {
          this.charWarning.style.display = "block";
          this.sendBtn.classList.add("user-field__btn--disable");
        } else if (+valueTextarea.length < this.maxChar) {
          this.charWarning.style.display = "none";
        }

      }
    };

    this.listenerUserForm();
  }

  private listenerUserForm(): void {
    if (this.textarea && this.sendBtn) {
      this.textarea.setAttribute("style", "height:" + this.textarea.scrollHeight + "px;overflow-y:hidden;");
      this.textarea.addEventListener("input", this.autosize, false);
      this.textarea.addEventListener("keyup", this.checkQuantityChar, false);
    }
  }

  public getValueTextarea(): string {
    const textareaElement: HTMLInputElement | null = document.querySelector(".user-field__textarea");
    const text = textareaElement !== null ? textareaElement.value : "";
    return text;
  }

  public clearTextarea(): void {
    const textareaElement: HTMLInputElement | null = document.querySelector(".user-field__textarea");
    const maxCharElement: HTMLInputElement | null = document.querySelector(".user-field__maxchar");
    if (textareaElement) textareaElement.value = "";
    if (maxCharElement) maxCharElement.innerHTML = `Max ${this.maxChar} symbols`;
    if (this.sendBtn) this.sendBtn.classList.add("user-field__btn--disable");
    if (this.textarea) this.textarea.style.height = "61px";
  }

  public focusTextarea(): void {
    if (this.textarea) this.textarea.focus();
  }

  public changedTextarea(textareaText: string): void {
    if (this.textarea) this.textarea.placeholder = textareaText;
  }

  public changeBtn(text: string): void {
    if (this.sendBtn) this.sendBtn.innerHTML = text;
  }
}
