import React from 'react';
import { atom, useAtom } from 'jotai';
import { styled } from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signUpService, UserType } from '../../service/superbase';

// interface UserType {
//   uid: string;
//   email: string;
//   password: string;
//   nickname: string;
//   profileImg: string;
// }

type SignUpType = {
  setLoginModal: (isOpen: boolean) => void;
  setSignUpmodal: (isOpen: boolean) => void;
};

export const userDataAtom = atom<UserType>({
  uid: '',
  email: '',
  password: '',
  nickname: '',
  profileImg: ''
});

const SignUp = ({ setLoginModal, setSignUpmodal }: SignUpType) => {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useAtom(userDataAtom);

  const signUpMutation = useMutation(signUpService, {
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [userData] });
    }
  });

  const signUpHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      signUpMutation.mutate(userData);
      alert('회원가입이 완료되었습니다!');
      setSignUpmodal(false);
      setLoginModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeSignUpModal = () => {
    setSignUpmodal(false);
  };

  return (
    <Container>
      <CloseBtn onClick={closeSignUpModal}>x</CloseBtn>
      <Wapper>
        <form onSubmit={signUpHandler}>
          이메일 :
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            placeholder="Email"
          ></input>
          비밀번호 :
          <input
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            placeholder="password"
          ></input>
          닉네임 :
          <input
            type="text"
            value={userData.nickname}
            onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
            placeholder="nickname"
          ></input>
          프로필 사진 :
          <input
            type="file"
            value={userData.profileImg}
            onChange={(e) => setUserData({ ...userData, profileImg: e.target.value })}
            placeholder="profileImg"
          ></input>
          <button>회원 가입 완료</button>
        </form>
      </Wapper>
    </Container>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 300px;
  height: 400px;

  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: gray;
  border: 1px solid black;
  border-radius: 8px;
`;

const Wapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
`;