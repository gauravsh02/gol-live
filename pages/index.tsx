import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import React, { useState, useEffect, useRef } from "react";
import SocketIOClient from "socket.io-client";

import GolGame from './GolGame';

const inter = Inter({ subsets: ['latin'] })

interface IMsg {
    user: string;
    msg: string;
}

export default function Home() {

    // connected flag
    const [connected, setConnected] = useState<boolean>(false);

    // init chat and message
    const [chat, setChat] = useState<IMsg[]>([]);
    const [msg, setMsg] = useState<string>("");

    useEffect((): any => {
        const socket = SocketIOClient.connect(process.env.BASE_URL, {
            path: "/api/socketio",
        });

        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);
            setConnected(true);
        });

        // update chat on new message dispatched
        socket.on("message", (message: IMsg) => {
            chat.push(message);
            setChat([...chat]);
        });

        // socket disconnet onUnmount if exists
        if (socket) return () => socket.disconnect();
    }, []);

    const sendMessage = async () => {
        // if (msg) {
        // build message obj
        const message: IMsg = {
            "user":"user"+Math.random(),
            "msg":msg+Math.random(),
        };

        // dispatch message to other users
        const resp = await fetch("/api/chat", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });

        // reset field if OK
        if (resp.ok) setMsg("");
        // }

        // focus after click
        // inputRef?.current?.focus();
    };


    return (
        <>
        <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="">
            <GolGame width={10} height={10} timeInterval={5000} />
        </div>
        </>
    )
}
