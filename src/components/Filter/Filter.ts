import CommentSystem from "../CommentSystem/CommentSystem";
import Comments from "../Comments/Comments";

// class for filter
export default class Filter extends CommentSystem {
  private commentSystemFilter: HTMLElement | null;
  private filterDropdown: HTMLElement | null;
  private filterFavorites: HTMLElement | null;

  private filterItems: NodeListOf<Element> | null;
  private filterSelected: HTMLElement | null;
  private filterList: HTMLElement | null;

  private comments: Comments;

  constructor(commentsObj: Comments) {
    super();
    this.comments = commentsObj;

    this.commentSystemFilter = document.querySelector(".comment-system__filter");
    this.filterDropdown = this.commentSystemFilter !== null ? this.commentSystemFilter.querySelector(".filter__dropdown") : null;
    this.filterFavorites = this.commentSystemFilter !== null ? this.commentSystemFilter.querySelector(".filter__favorites") : null;
  
    this.filterItems = this.filterDropdown !== null ? this.filterDropdown.querySelectorAll(".filter__item") : null;
    this.filterSelected = this.filterDropdown !== null ? this.filterDropdown.querySelector(".filter__selected") : null;
    this.filterList = this.filterDropdown !== null ? this.filterDropdown.querySelector(".filter__list") : null;

    this.filterDirectionListener();
    this.dropdown();
    this.favoritesCommentFilter();
  }


  // method to apply the current filter
  public currentFilter(): void {
    if (this.filterSelected) {
      switch (this.filterSelected.innerHTML) {
        case "By Date":
          this.dateFilter();
          break;
        case "By Rating":
          this.ratingFilter();
          break;
        case "By Replies":
          this.replyNumberFilter();
          break;
      }
    }
  }

  private filterDirectionListener(): void {
    const filterDirectionBtn: HTMLElement | null = this.filterDropdown !== null ? this.filterDropdown.querySelector(".filter__direction") : null;
    
    if (filterDirectionBtn) filterDirectionBtn.addEventListener("click", () => {
      if (filterDirectionBtn.style.rotate === "0deg") {
        filterDirectionBtn.style.rotate = "180deg";
      } else {
        filterDirectionBtn.style.rotate = "0deg";
      }
      this.currentFilter();
    });
  }

  private filterDirection(): number | void {
    const filterDirectionBtn: HTMLElement | null = this.filterDropdown !== null ? this.filterDropdown.querySelector(".filter__direction") : null;

    if (filterDirectionBtn) {
      if (filterDirectionBtn.style.rotate === "0deg") {
        return -1;
      } else {
        return 1;
      }
    }
  }

  private favoritesCommentFilter(): void {
    const listener = (event: any) => {
      event.target.classList.toggle("filter__favorites_active");

      if (event.target.classList.contains("filter__favorites_active")) {
        super.userBlockHidden(true);
        this.comments.hiddenComments(true);
        this.comments.favorites.renderFavoriteComments();
      } else {
        super.userBlockHidden(false);
        this.comments.hiddenComments(false);
        this.comments.favorites.cleanFavoriteComments();
        this.comments.updateComments();
      }
    };

    if (this.filterFavorites) this.filterFavorites.addEventListener("click", listener);
  }

  private dropdown(): void {

    if (this.filterDropdown) {
      if (this.filterSelected !== null) this.filterSelected.addEventListener("click", () => { 
        if (this.filterList !== null) {
          if (this.filterList.style.display === "block") {
            this.filterList.style.display = "none";
          } else {
            this.filterList.style.display = "block";
          }
        }

        if (this.filterItems !== null) this.filterItems.forEach((item: any) => this.chooseItem(item));
      });
    }
  }

  private chooseItem(item: any): void {
    const span: HTMLElement | null = item.querySelector("span");
    const svg: SVGSVGElement | null = item.querySelector("svg");

    if (span && this.filterSelected && span.innerHTML === this.filterSelected.innerHTML) {
      if (svg !== null) svg.style.display = "block";
    }

    item.removeEventListener("click", this.itemListener);
    item.addEventListener("click", this.itemListener);
  }

  private itemListener = (event: any) => {
    if (this.filterSelected !== null) {
      this.filterSelected.innerHTML = event.target.innerHTML;

      switch (event.target.innerHTML) {
        case "By Replies":
          this.replyNumberFilter();
          break;
        case "By Rating":
          this.ratingFilter();
          break;
        case "By Date":
          this.dateFilter();
          break;
      }
    }

    if (this.filterItems !== null) this.filterItems.forEach(item => {
      const svg: SVGSVGElement | null = item.querySelector("svg");
      if (svg !== null) svg.style.display = "none";
    });

    if (this.filterList !== null) this.filterList.style.display = "none";
  };

  /*------------- Filters -------------*/

  private dateFilter(): void {
    const data = super.getDATA();
    const array = data.history;
    const direction = this.filterDirection();

    const newArr = array.sort((commentBlock_1: any, commentBlock_2: any) => {
      const a = new Date(commentBlock_1.comment.commentTime.fullDate).getTime();
      const b = new Date(commentBlock_2.comment.commentTime.fullDate).getTime();

      if (direction > 0) return a - b;
      if (direction < 0) return b - a;
    });

    data.history = newArr;
    localStorage.setItem("DATA", JSON.stringify(data));
    this.comments.updateComments();
  }

  private ratingFilter(): void {
    const data = super.getDATA();
    const array = data.history;
    const direction = this.filterDirection();

    const newArr = array.sort((commentBlock_1: any, commentBlock_2: any) => {
      const a = commentBlock_1.rating;
      const b = commentBlock_2.rating;

      if (direction > 0) return a - b;
      if (direction < 0) return b - a;
    });

    data.history = newArr;
    localStorage.setItem("DATA", JSON.stringify(data));
    this.comments.updateComments();
  }

  private replyNumberFilter(): void {
    const data = super.getDATA();
    const array = data.history;
    const direction = this.filterDirection();

    const newArr = array.sort((commentBlock_1: any, commentBlock_2: any) => {
      const a = Object.keys(commentBlock_1.replies).length;
      const b = Object.keys(commentBlock_2.replies).length;

      if (direction > 0) return a - b;
      if (direction < 0) return b - a;
    });

    data.history = newArr;
    localStorage.setItem("DATA", JSON.stringify(data));
    this.comments.updateComments();
  }
}