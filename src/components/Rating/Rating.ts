import CommentSystem from "../CommentSystem/CommentSystem";

// class for rating system
export default class Rating extends CommentSystem {

  public addListenerCommentsRatingBtns(commentID: number): void {
    const commentBlockEl: HTMLElement | null = document.querySelector(`[data-commentid="${commentID}"]`);
    if (commentBlockEl) {
      const ratingBtnBlock: HTMLElement | null = commentBlockEl.querySelector(".comment-block__btn-rating");
      if (ratingBtnBlock) this.listenerBtnBlock(ratingBtnBlock, commentID);
    }
  }

  public addListenerReplyRatingBtns(commentID: number, replyID: number): void {
    const commentBlockEl: HTMLElement | null = document.querySelector(`[data-commentid="${commentID}"]`);
    if (commentBlockEl) {
      const replyEl: HTMLElement | null = commentBlockEl.querySelector(`[data-replyid="${replyID}"]`);
      if (replyEl) {
        const ratingBtnBlock: HTMLElement | null = replyEl.querySelector(".comment-block__btn-rating");
        if (ratingBtnBlock) this.listenerBtnBlock(ratingBtnBlock, commentID, replyID);
      }
    }
  }

  private listenerBtnBlock(ratingBlock: HTMLElement | null, commentID: number, replyID?: number): void {
    const currentData = super.getDATA();

    if (ratingBlock) {
      const plusBtn: HTMLElement | null = ratingBlock.querySelector(".btn-rating__plus");
      const minusBtn: HTMLElement | null = ratingBlock.querySelector(".btn-rating__minus");
      const counter: HTMLElement | null = ratingBlock.querySelector(".btn-rating__counter");

      if (counter) {
        let curCounter: number = 0;
        if (replyID === undefined) {
          currentData.history.forEach((commentBlock: any) => {
            if (+commentBlock.commentID === commentID) {
              curCounter = commentBlock.rating === undefined ? 0 : +commentBlock.rating;
            }
            counter.innerHTML = String(curCounter);
            this.changeStyleCounter(counter, curCounter);
          });
        } else {
          currentData.history.forEach((commentBlock: any) => {
            if (+commentBlock.commentID === commentID) {
              curCounter = commentBlock.replies[`reply_${replyID}`].rating === undefined
              ? 0
              : +commentBlock.replies[`reply_${replyID}`].rating;
            }
            counter.innerHTML = String(curCounter);
            this.changeStyleCounter(counter, curCounter);
          });
        }

        let newCounter: number = curCounter;
        const plusListener = () => {
          if (plusBtn && minusBtn) {
            if (!(plusBtn.classList.contains("btn-rating__plus--disable"))) {
              newCounter++;

              if (newCounter !== curCounter) {
                plusBtn.classList.add("btn-rating__plus--disable");
              }

              minusBtn.classList.remove("btn-rating__minus--disable");

              counter.innerHTML = String(newCounter);
              this.updateCounterHistory(newCounter, commentID, replyID);
              this.changeStyleCounter(counter, newCounter);
            }
          }
        };

        const minusListener = () => {
          if (plusBtn && minusBtn) {
            if (!(minusBtn.classList.contains("btn-rating__minus--disable"))) {
              newCounter--;

              if (newCounter !== curCounter) {
                minusBtn.classList.add("btn-rating__minus--disable");
              }

              plusBtn.classList.remove("btn-rating__plus--disable");

              counter.innerHTML = String(newCounter);
              this.updateCounterHistory(newCounter, commentID, replyID);
              this.changeStyleCounter(counter, newCounter);
            }
          }
        };

        if (plusBtn) plusBtn.addEventListener("click", plusListener);
        if (minusBtn) minusBtn.addEventListener("click", minusListener);
      }
    }
  }

  private updateCounterHistory(curCounter: number, commentID: number, replyID?: number): void {
    const currentData = super.getDATA();

    if (replyID === undefined) {
      let newCommentBlock: any;
      currentData.history.forEach((commentBlock: any) => {
        if (+commentBlock.commentID === commentID) {
          commentBlock.rating = curCounter;
          newCommentBlock = commentBlock;
        }
      });

      currentData.history.forEach((commentBlock: any, index: number) => {
        if (+commentBlock.commentID === commentID) {
          currentData.history[index] = newCommentBlock;
        }
      });
      localStorage.setItem("DATA", JSON.stringify(currentData));
    } else {
      currentData.history.forEach((commentBlock: any) => {
        if (+commentBlock.commentID === commentID) {
          commentBlock.replies[`reply_${replyID}`].rating = curCounter;
          super.updateHistoryReply(commentID, replyID, commentBlock.replies[`reply_${replyID}`]);
        }
      });
    }
  }

  private changeStyleCounter(counterElement: HTMLElement, counterNumber: number): void {
    if (counterNumber > 0) {
      counterElement.style.color = "#8AC540";
    } else if (counterNumber < 0) {
      counterElement.style.color = "#FF0000";
      counterElement.innerHTML = String(+counterElement.innerHTML * -1);
    } else {
      counterElement.style.color = "#000000";
    }
  }
}