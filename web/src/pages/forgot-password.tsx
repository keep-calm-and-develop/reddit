import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorsMap';
import login from './login';

interface ForgotPasswordProps {

}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    await forgotPassword(values);
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) => (
                    complete ? 
                    <Box>
                        Please check your inbox for reset password link
                    </Box>
                    :
                    <Form>
                        <InputField
                            name="email"
                            placeholder="Email"
                            label="Email"
                            type="email"
                        />
                        <Button
                            mt={4}
                            type="submit"
                            color="teal"
                            isLoading={isSubmitting}
                        >Forgot Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);