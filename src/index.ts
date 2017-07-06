import * as firebase from "firebase/app";
import "firebase/auth";

import { Kanban } from "./kanban/Kanban";
import { User } from "./user/User";

class Index {
    private auth: firebase.auth.Auth = null;
    private authProvider: firebase.auth.GoogleAuthProvider = null;

    constructor() {
        // 파이어베이스 초기화
        const config = {
            apiKey: "AIzaSyCKft015Ehm_OwFqYbJOmAdwm4pQNrunKA",
            authDomain: "udsdev-kanban.firebaseapp.com",
            databaseURL: "https://udsdev-kanban.firebaseio.com",
            messagingSenderId: "339499578388",
            projectId: "udsdev-kanban",
            storageBucket: "udsdev-kanban.appspot.com"
        };
        firebase.initializeApp(config);

        this.auth = firebase.auth();
        this.authProvider = new firebase.auth.GoogleAuthProvider();
        // 성공 실패 구분
        this.auth.onAuthStateChanged((user: firebase.User) => {
            if (user) {
                // 인증 성공시
                // 사용자 정보 저장
                User.userInfo = user;

                // 칸반 앱 실행
                const kanban = new Kanban();
                kanban.getKanbanList();
            } else {
                // 인증 실패시, 인증창으로 이동
                this.auth.signInWithPopup(this.authProvider);
            }
        });

    }
}

const index = new Index();