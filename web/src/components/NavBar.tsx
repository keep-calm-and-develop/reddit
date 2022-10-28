import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Button } from '@chakra-ui/button';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery({
        pause: isServer(),
    });
    const [{ fetching: logoutFetching },logout] = useLogoutMutation();

    let body = null;
    if (fetching) {
        // data loading
    } else if (!data?.me) {
        body = (
            <>
            <NextLink href="/login">
                <Link mr={4}>
                    Login
                </Link>
            </NextLink>
            <NextLink href="register">
                <Link>
                    Register
                </Link>
            </NextLink>
            </>
        );
        // user not logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button
                    isLoading={logoutFetching}
                    onClick={() => {
                        logout();
                    }}
                    variant="link"
                >Logout</Button>
            </Flex>
        )
        // user logged in
    }
    return (
        <Flex bg="lightgrey" p={4} >
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}