import { useContext, useEffect, useCallback, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContextProvider';
import { SocketContext } from '../../contexts/SocketContextProvider';
import { leaveChat, joinChat } from '../../helpers/socket';
import ENDPOINTS from '../../constants/endpoints';
import * as Styled from './styled';
import useLocationId from '../../hooks/useLocationId';

const Chat = ({ toggleContactsDrawer, toggleFilesDrawer }) => {
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const { locationId: chatId } = useLocationId();
    const [messages, setMessages] = useState([]);
    const messagesContainerRef = useRef();
    let prevChatId = chatId;

    const sendMessage = (e) => {
        e.preventDefault();
        const form = e.target;
        const newMessage = form.newMessage.value;
        if (newMessage) {
            socket.emit('sendMessage', chatId, newMessage);
            form.reset();
        }
    };

    const scrollDown = () => {
        const messagesContainer = messagesContainerRef.current;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const loadMessages = useCallback(async () => {
        if (chatId) {
            const response = await fetch(`${ENDPOINTS.api}/${chatId}/messages`);
            const data = await response.json();
            setMessages(data);
        }
    }, [chatId]);

    const leaveCurrentChat = useCallback((chatId) => {
        leaveChat(socket, prevChatId);
        setMessages([]);
        prevChatId = chatId;
    }, []);

    useEffect(() => {
        leaveCurrentChat(chatId);
        joinChat(socket, chatId);
        loadMessages();
    }, [chatId]);

    useEffect(() => {
        if (socket) {
            socket.on('message', (message) => {
                setMessages([...messages, message]);
            });
        }
        scrollDown();
    }, [messages, socket]);

    return (
        <Styled.Chat>
            <Styled.Controls>
                <Styled.Control onClick={toggleContactsDrawer}>
                    Contacts
                </Styled.Control>
                <Styled.Control onClick={toggleFilesDrawer}>
                    Files
                </Styled.Control>
            </Styled.Controls>
            <Styled.Messages ref={messagesContainerRef}>
                {messages?.length
                    ? messages.map((message) => {
                          if (message.userId === user.id) {
                              return (
                                  <Styled.Message key={message.id} currentUser>
                                      {message.content}
                                  </Styled.Message>
                              );
                          } else {
                              return (
                                  <Styled.Message key={message.id}>
                                      {message.content}
                                  </Styled.Message>
                              );
                          }
                      })
                    : null}
            </Styled.Messages>
            <Styled.Form onSubmit={sendMessage}>
                <Styled.TextArea
                    type="text"
                    placeholder="Aa"
                    name="newMessage"
                    id="newMessage"
                />
                <Styled.PositionedSendButton />
            </Styled.Form>
        </Styled.Chat>
    );
};

export default Chat;
