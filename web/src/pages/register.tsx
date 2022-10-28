import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorsMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "", username: "", password: "" }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await register({ options: values });
                    if (response.data?.register?.errors) {
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user) {
                        // worked
                        router.push('/');
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />
                        <Box mt={4}>
                        <InputField
                            name="email"
                            placeholder="email"
                            label="Email"
                        />
                        </Box>
                        <Box mt={4}>
                        <InputField
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                        />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            color="teal"
                            isLoading={isSubmitting}
                        >Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);