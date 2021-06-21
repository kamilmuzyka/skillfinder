import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import useLocationId from '../../hooks/other/useLocationId';
import useChat from '../../hooks/api/useChat';
import useChatUpload from '../../hooks/api/useChatUpload';
import useDownloadFile from '../../hooks/api/useDownloadFile';
import { UserContext } from '../../contexts/UserContextProvider';
import * as Styled from './styled';
import AttachButton from '../AttachButton/index';
import SendButton from '../SendButton/index';
import CloseButton from '../CloseButton/index';
import MESSAGE_TYPES from '../../constants/messageTypes';

const Chat = () => {
    const { user } = useContext(UserContext);
    const { locationId } = useLocationId();
    const { downloadFile } = useDownloadFile();
    const { uploadFile, setFilePayload } = useChatUpload();
    const { messages, setNewMessage, sendMessage } = useChat(locationId);
    const [isMessageBoxActive, setIsMessageBoxActive] = useState(true);
    const messagesFormRef = useRef();
    const messagesContainerRef = useRef();
    const fileInputRef = useRef();
    const fileNameRef = useRef();
    const fileLabelRef = useRef();
    const messageBoxRef = useRef();

    const clearMessageBox = useCallback(() => {
        messagesFormRef.current.reset();
    }, []);

    const clearMessageContent = useCallback(() => {
        messageBoxRef.current.value = '';
    }, []);

    const scrollMessageBox = useCallback(() => {
        const messagesContainer = messagesContainerRef.current;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, []);

    const addFilePayload = useCallback(
        (e) => {
            if (!e.target.files[0]) {
                return;
            }
            fileNameRef.current.textContent = e.target.files[0].name;
            fileLabelRef.current.classList.add('active');
            messageBoxRef.current.focus();
            clearMessageContent();
            setFilePayload(e.target.files[0]);
            setNewMessage('');
            setIsMessageBoxActive(false);
        },
        [clearMessageContent, setFilePayload, setNewMessage]
    );

    const clearFilePayload = useCallback(() => {
        fileLabelRef.current.classList.remove('active');
        setFilePayload(null);
        setIsMessageBoxActive(true);
    }, [setFilePayload]);

    const openFileInput = useCallback((e) => {
        e.preventDefault();
        fileInputRef.current.click();
    }, []);

    const sendNewMessage = useCallback(
        (e) => {
            const isKeydown = e.type === 'keydown' && e.keyCode === 13;
            const isClick = e.type === 'click';
            if (isKeydown || isClick) {
                e.preventDefault();
                sendMessage();
                uploadFile();
                clearFilePayload();
            }
        },
        [sendMessage, uploadFile, clearFilePayload]
    );

    useEffect(() => {
        clearMessageBox();
        scrollMessageBox();
    }, [messages, clearMessageBox, scrollMessageBox]);

    return (
        <Styled.Chat>
            <Styled.Messages ref={messagesContainerRef}>
                {messages?.length
                    ? messages.map((message) => {
                          const currentUser =
                              message.userId === user.id
                                  ? { currentUser: 'true' }
                                  : {};
                          if (message.type === MESSAGE_TYPES.text) {
                              return (
                                  <Styled.Message
                                      key={message.id}
                                      {...currentUser}
                                      dangerouslySetInnerHTML={{
                                          __html: message.content,
                                      }}
                                  />
                              );
                          }
                          if (message.type === MESSAGE_TYPES.image) {
                              const imageUri = `/${message.content}`;
                              return (
                                  <Styled.MessageImage
                                      key={message.id}
                                      href={imageUri}
                                      {...currentUser}
                                  >
                                      <img src={imageUri} alt="" />
                                  </Styled.MessageImage>
                              );
                          }
                          if (message.type === MESSAGE_TYPES.file) {
                              const fileUri = `/${message.content}`;
                              const fileName = message.content.split('/').pop();
                              return (
                                  <Styled.MessageFile
                                      key={message.id}
                                      {...currentUser}
                                      onClick={() =>
                                          downloadFile(fileUri, fileName)
                                      }
                                  >
                                      {fileName}
                                  </Styled.MessageFile>
                              );
                          }
                      })
                    : null}
            </Styled.Messages>
            <Styled.MessageBox ref={messagesFormRef}>
                <Styled.TextArea
                    type="text"
                    placeholder="Aa"
                    name="newMessage"
                    id="newMessage"
                    onChange={(e) =>
                        isMessageBoxActive
                            ? setNewMessage(e.target.value)
                            : clearMessageContent()
                    }
                    onKeyDown={(e) => sendNewMessage(e)}
                    ref={messageBoxRef}
                ></Styled.TextArea>
                <Styled.FileUpload>
                    <Styled.FileLabel htmlFor="newFile" ref={fileLabelRef}>
                        <Styled.FileName ref={fileNameRef}></Styled.FileName>
                        <CloseButton
                            onClick={(e) => {
                                e.preventDefault();
                                clearFilePayload();
                            }}
                        />
                    </Styled.FileLabel>
                    <Styled.FileInput
                        id="newFile"
                        type="file"
                        hidden
                        onChange={addFilePayload}
                        ref={fileInputRef}
                    />
                </Styled.FileUpload>
                <Styled.Buttons>
                    <AttachButton onClick={openFileInput}>
                        Add file
                    </AttachButton>
                    <SendButton onClick={(e) => sendNewMessage(e)} />
                </Styled.Buttons>
            </Styled.MessageBox>
        </Styled.Chat>
    );
};

export default Chat;
