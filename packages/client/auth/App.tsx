import { h, Fragment } from 'preact';
import { Form, FormType, FormProps } from './components/Form';
import { Header } from './components/Header';

interface Props extends Omit<FormProps, 'type'> {
  type?: FormType;
}

export function App(props: Props) {
  const { type } = props;
  return (
    <>
      <Header type={type} />
      {type ? <Form {...props} type={type} /> : undefined}
    </>
  );
}
