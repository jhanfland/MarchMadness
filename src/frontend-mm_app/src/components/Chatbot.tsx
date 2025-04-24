import { SendHorizonal, XCircle, MessageSquare, Bot  } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

// Types
interface ChatMessage {
  className: 'incoming' | 'outgoing';
  message: React.ReactNode;
}

/**
 * Chatbot Component
 * 
 * A React component that provides a conversational interface for the March Madness application.
 * It allows users to interact with a chatbot to navigate the app, get help with account management,
 * and access tournament information.
 * 
 * @returns The rendered Chatbot component
 */
const Chatbot = () => {
  const [showChatbot, setChatbot] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      className: 'incoming',
      message: <>Hi there! My name is Cooper<br />How can I help you today?</>
    }
  ]);

  const chatBoxRef = useRef<HTMLUListElement>(null);

  /**
   * Scrolls the chat box to the bottom when new messages are added
   */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [chatHistory]);

  /**
   * Updates the last message in the chat history with new content
   * 
   * @param newMessage - The new message content to display
   */
  const _updateLastMessage = (newMessage: React.ReactNode): void => {
    setChatHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const updatedHistory = [...prevHistory];
      updatedHistory[updatedHistory.length - 1] = {
        ...updatedHistory[updatedHistory.length - 1],
        message: newMessage,
      };

      return updatedHistory;
    });
  };

  /**
   * Handles changes to the input field, updating the chatInput state
   * 
   * @param event - The change event from the textarea
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setChatInput(event.target.value);
  };

  /**
   * Handles keyboard events in the input field
   * Submits the message when Enter is pressed (without Shift)
   * 
   * @param event - The keyboard event
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleChat();
    }
  };

  /**
   * Processes the current chat input, adds it to the chat history,
   * and triggers the AI response
   */
  const handleChat = (): void => {
    const message = chatInput.trim();
    if (message) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: message, className: 'outgoing' }
      ]);
      setChatInput("");
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { message: "I'm gathering the details for you...", className: "incoming" }
        ]);
        _aiResponse(message);
      }, 500);
    }
  };

  /**
   * Makes an API call to Wit.ai to process the user's message
   * and determine the appropriate response based on detected intents
   * 
   * @param message - The user's message to process
   */
  const _aiResponse = (message: string): void => {
    // Make Wit.ai API call through our backend proxy
    fetch(`http://localhost:8000/api/witai?message=${encodeURIComponent(message)}`)
    .then(response => response.json())
    .then(data => {
      // Handle the Wit.ai response based on detected intent
      if (data.intents && data.intents.length > 0) {
        const intent = data.intents[0].name;
        // Process the intent and provide appropriate response 
        switch (intent) {
          case 'hello':
            _updateLastMessage("Hello! How can I assist you today?");
            break;
          case 'app_features':
            _updateLastMessage("I can help you fill out your bracket, check scores, and more!");
            break;
          case 'future_features':
            _updateLastMessage("We're working on currency features, live game feedback, and advanced bracket analytics. Stay tuned!");
            break;
          case 'live_bracket':
            _updateLastMessage("You can check the live bracket on the 'Live Bracket' page to see updated match results and progression.");
            break;
          case 'login_help':
            _updateLastMessage("Having trouble logging in? Make sure your email and password are correct. You can also click 'Show Password' to make sure you typed it correct.");
            break;
          case 'signup_help':
            _updateLastMessage("To sign up, click 'Sign Up Now' and follow the steps to create your account.");
            break;
          case 'user_bracket':
            _updateLastMessage("You can create your own bracket on the 'My Bracket' page.");
            break;
          case 'edit_bracket':
            _updateLastMessage("You can edit your bracket on the 'My Bracket' page. Just click on the bracket you want to edit.");
            break;
          case 'scoring':
            _updateLastMessage("Points are awarded for each correct pick. The further into the tournament, the more points each round is worth.");
            break;
          case 'acknowledge':
            _updateLastMessage("Of course. If you have any other questions, feel free to ask!");
            break;
          default:
            // Use OpenAI API through our backend proxy
            fetch('http://localhost:8000/api/openai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message })
            })
            .then(res => res.json())
            .then(data => {
              if (data.error) {
                throw new Error(data.error);
              }
              _updateLastMessage(data.choices[0].message.content);
            })
            .catch(() => {
              _updateLastMessage("I'm sorry, I couldn't understand that. Please try again.");
            });
        }
      } else {
        // Use OpenAI API through our backend proxy when no intent is detected
        fetch('http://localhost:8000/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          _updateLastMessage(data.choices[0].message.content);
        })
        .catch(() => {
          _updateLastMessage("I'm sorry, I couldn't understand that. Please try again.");
        });
      }
    })
    .catch(error => {
      console.error('Error calling Wit.ai:', error);
      _updateLastMessage("Sorry, I'm having trouble connecting right now.");
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="fixed right-6 bottom-6 w-12 h-12 text-white bg-[#2C5AB7] cursor-pointer border-none outline-none rounded-full transition-all duration-500 ease-in-out z-[1000] hover:scale-125 flex items-center justify-center"
        onClick={() => setChatbot(!showChatbot)}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot Container */}
      <div className={`fixed right-6 bottom-24 bg-white w-[400px] rounded-lg shadow-xl overflow-hidden z-[1000] ${showChatbot ? 'block' : 'hidden'}`}>
        {/* Header */}
        <header className="bg-[#2C5AB7] py-4 text-center flex items-center justify-between px-4">
          <div className="w-8"></div>
          <h2 className="text-white text-xl">Chatbot</h2>
          <XCircle 
            className="text-white cursor-pointer transition-all duration-500 ease-in-out hover:scale-110" 
            onClick={() => setChatbot(false)} 
          />
        </header>

        {/* Chat Box */}
        <ul 
          ref={chatBoxRef}
          className="h-[300px] overflow-y-auto p-[30px_20px_70px]"
        >
          {chatHistory.map((chat, index) => (
            <li 
              key={index} 
              className={`flex ${chat.className === 'outgoing' ? 'justify-end' : ''} my-5`}
            >
              {chat.className === 'incoming' && (
                <Bot 
                  className="h-8 w-8 text-[#2C5AB7] text-center leading-8 rounded mr-2.5 self-end mb-1.5" 
                />
              )}
              <p className={`max-w-[70%] text-sm whitespace-pre-wrap p-3 rounded ${
                chat.className === 'incoming' 
                  ? 'text-black bg-gray-100 rounded-tl-none' 
                  : 'text-white bg-[#2C5AB7] rounded-tr-none'
              }`}>
                {chat.message}
              </p>
            </li>
          ))}
        </ul>

        {/* Chat Input */}
        <div className="flex flex-row p-2 border-t border-[#2C5AB7] gap-2.5">
          <textarea
            placeholder="Enter a message..."
            value={chatInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            required
            className="flex-1 text-sm outline-none border-none resize-none bg-white p-2 min-h-[40px] max-h-[120px] text-black"
          />
          <SendHorizonal 
            className="self-end text-[#2C5AB7] cursor-pointer transition-all duration-500 ease-in-out hover:scale-110" 
            onClick={handleChat}
            size={20}
          />
        </div>
      </div>
    </>
  );
};

export default Chatbot;