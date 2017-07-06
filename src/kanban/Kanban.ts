import * as firebase from "firebase/app";
import "firebase/database";

import { User } from "../user/User";

export interface IKanban {
  getKanban(key: string): void;
}

export class Kanban implements IKanban {
  private database: firebase.database.Database = firebase.database();
  private selectedKey: string = null;

  constructor() {
    document.getElementsByTagName("textarea")[0].onblur = () => {
      // 입력창을 벗어나면, 칸반 입력
      this.insertKanban();
    };

    // 초기화 버튼 이벤트 등록
    document.getElementById("initButton").onclick = () => {
      this.initKanban();
    };
  }

  public getKanbanList(): void {
    const kanbanRef = this.database.ref("kanbans/" + User.userInfo.uid);
    console.log(kanbanRef);
    // Firebase는 비동기 방식, FB DB에 추가되면 즉시 콜백으로 데이터를 받아온다.
    kanbanRef.on("child_added", this.onChildAdded);
    kanbanRef.on("child_changed", this.onChildChanged);
  }

  public onChildAdded = (data: firebase.database.DataSnapshot): void => {
    const key = data.key;
    const kanbanData = data.val();
    const txt = kanbanData.txt;
    const title = txt.substr(0, txt.indexOf("\n"));
    const firstTxt = txt.substr(0, 1);
    const html =
      "<li id='" + data.key + "' class=\"collection-item avatar\">" +
      "<i class=\"material-icons circle red\">" + firstTxt + "</i>" +
      "<span class=\"title\">" + title + "</span>" +
      "<p class='txt'>" + txt + "<br>" +
      "</p>" +
      "<a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">grade</i></a>" +
      "</li>";

    // element를 생성하여 추가합니다.
    const template = document.createElement('template');
    template.innerHTML = html;
    document.getElementsByClassName("collection")[0].appendChild(template.content.firstChild);

    // 클릭 이벤트를 추가합니다.
    this.addGetKanbanClickEvent(key);
    this.addDeleteKanbanClickEvent(key);
  }

  public onChildChanged(data: firebase.database.DataSnapshot): void {
    const key = data.key;
    const txt = data.val().txt;
    const title = txt.substr(0, txt.indexOf("\n"));
    const firstTxt = txt.substr(0, 1);
    const element = document.getElementById(key);

    element.getElementsByClassName("title")[0].innerHTML = title;
    element.getElementsByClassName("txt")[0].innerHTML = txt;
    element.getElementsByClassName("material-icons")[0].innerHTML = firstTxt;
  }

  public getKanban(key: string): void {
    this.selectedKey = key;

    // 한건만 가져옴.
    const kanbanRef = this.database.ref("kanbans/" + User.userInfo.uid + "/" + key)
      .once('value').then((snapshot: firebase.database.DataSnapshot) => {
        if (snapshot.val() != null) {
          document.getElementsByTagName("textarea")[0].value = snapshot.val().txt;
        }
      });
  }

  public addGetKanbanClickEvent(key: string) {
    const element = document.getElementById(key);
    element.onclick = () => {
      this.getKanban(key);
    };
  }

  public addDeleteKanbanClickEvent(key: string) {
    const element = document.getElementById(key).getElementsByTagName("a")[0];
    element.onclick = () => {
      this.deleteKanban(key);
    };
  }

  public insertKanban(): void {
    const text = document.getElementsByTagName("textarea")[0].value;

    // 메모가 비어있을 때는 입력하지 않음.
    if (text === '') {
      return;
    }
    if (this.selectedKey) {
      const kanbanRef = this.database.ref("kanbans/" + User.userInfo.uid + "/" + this.selectedKey);
      kanbanRef.update({
        createDate: new Date().getTime(),
        txt: text,
        updateDate: new Date().getTime()
      });
    } else {
      // 삽입
      const kanbanRef = this.database.ref("kanbans/" + User.userInfo.uid);
      kanbanRef.push({
        createDate: new Date().getTime(),
        txt: text
      });
    }

    this.initKanban();
  }

  public deleteKanban(key: string): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }
    const kanbanRef = this.database.ref("kanbans/" + User.userInfo.uid + "/" + key);
    kanbanRef.remove();

    document.getElementById(key).remove();
    this.initKanban();
  }

  public initKanban(): void {
    this.selectedKey = null;
    document.getElementsByTagName("textarea")[0].value = "";
  }
}