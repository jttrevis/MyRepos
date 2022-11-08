import React from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus } from 'react-icons/fa';
export const Main = () => {
  return (
    <Container>
      <h1><FaGithub size={25} />Main</h1>


      <Form onSubmit={() => { }}>
        <input type="text" placeholder='Add Repository' />


        <SubmitButton>
          <FaPlus color='#fff' size={14} />
        </SubmitButton>
      </Form>

    </Container>
  );
};
