import React, { useEffect, useState } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Alert,
  Text,
  View,
} from 'react-native';

import Vivocha, { VivochaValues } from 'react-native-vivocha';

const vivocha = Vivocha.instance;

function App() {
  const [status, setStatus] = useState('Disconnected');
  const [available, setAvailable] = useState(false);
  const [agents, setAgents] = useState(0);

  useEffect(() => {
    const eventHandlers : Record<string, (event: string, data: any) => void> = {
      agentdata: onAgentData,
      persistence: onPersistence,
      agentpresence: logEvent,
      agenttyping: logEvent,
      chatackreceived: logEvent,
      chatacksent: logEvent,
      closeremote: logEvent,
      actionsent: logEvent,
      messagereceived: logEvent,
      messagesent: logEvent,
      attachmentreceived: logEvent,
      attachmentsent: logEvent,
      screenshotsession: logEvent,
      terminate: logEvent,
      transferred: logEvent,
      terminatebutton: logEvent,
    };

    // Add event listeners for Vivocha events
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      vivocha.on(event, (data: any) => handler(event, data));
    });

    registerForCustomAction();

    startVivocha();

    return () => {
      // Clean up event listeners
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        vivocha.off(event, handler);
      });
    };
  }, []);


  //Event handlers
  const logEvent = (event: string, data: any) => console.log(`VIVOCHA: event -> ${event} `, data);

  const onAgentData = (event: string, data: any) => {
    logEvent(event, data);
    setAvailable(data.available);
    setAgents(data?.data?.chat?.agents || 0);
  };

  const onPersistence = (event: string, data: any) => {
    logEvent(event, data);
    console.log('Vivocha contact:', vivocha.getContact());
    console.log('Vivocha unread messages:', vivocha.getUnreadMessageCount());
    console.log('Vivocha conversation:', vivocha.getConversation());
  };


  // Vivocha actions
  const startVivocha = () => {
    setStatus('Starting...');

    vivocha.sideTab = false;

    const vivochaAcctId = "vvc_mike71";
    const vivochaServId = Platform.select({
      android: '5efdf3e184ed030007bdd3b0-1732018281704',
      ios: '5efdf3e184ed030007bdd3b0-1737018697088',
      default: '',
    }) as string;

    vivocha.start(vivochaAcctId, vivochaServId, { 
      blockSideTab: true,  // Block the default side tab in order to use the custom one
      developerMode: true  // Enable developer mode to see logs in the console
    })
      .then(() => { setStatus('Connected'); })
      .catch(() => setStatus('Error') );
  };

  const registerForCustomAction = () => {
    // Type this command in the Vivocha Agent console during a contact to send the action to the mobile app
    // !action|my_custom_action|["data1","data2"]
    vivocha.onAction('my_custom_action', onEventFromAgent);
  };

  const createOrOpenContact = () => {
    if (vivocha.getContact()) {
      console.log('Vivocha open chat:', vivocha.getContact());
      vivocha.showView(true);
    } else {
      const dataCollection = [
        {
            "name": "ReactAppData",
            "desc": "React Native Demo Data",
            "data": [
                {
                    "desc": "First Name",
                    "name": "first_name",
                    "type": "firstname",
                    "value": "Michael",
                    "visible": true
                },
                {
                    "desc": "Name",
                    "name": "last_name",
                    "type": "lastname",
                    "value": "Siddi",
                    "visible": true
                },
                {
                    "desc": "Comment",
                    "name": "comment",
                    "type": "text",
                    "value": "This is a comment",
                    "visible": true
                },
                {
                    "desc": "A value not visible to the agent",
                    "name": "secret",
                    "type": "text",
                    "value": "This is a secret value",
                    "visible": false
                }
            ]
        }
    ];

      vivocha.setDataCollection(dataCollection);

      vivocha.createChat()
        .then(() => vivocha.showView(true))
        .catch(() => Alert.alert('Error creating contact', 'Errore', [{ text: 'OK' }]));

      // If you want to create a contact of a different type, use the following method:
      // vivocha.createContact(dataCollection, "chat", { .. params ..} })
      // .then(() => vivocha.showView(true))
      // .catch(() => Alert.alert('Error creating contact', 'Errore', [{ text: 'OK' }]));
    }
  };

  const setRandomTheme = () => {
    const randomColorHex = `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')}`;

    vivocha.theme = {
      [VivochaValues.THEME_CHAT_TOP_VIEW_BACKGROUND_COLOR]: randomColorHex
    }
  }

  const closeContact = () => {
    vivocha.terminate(true);
  }

  const sendCustomAction = () => {
    vivocha.sendAction('my_sent_action', 'my_action_id', ["param1", "param2"]);
  }

  const changeLanguage = () => {
    vivocha.addLocalization('de', {
      [VivochaValues.UI_BTN_CLOSE]: 'ESCI_DE'
    });
    vivocha.language = 'de';
  };

  const sendAttachment = () => {
    vivocha.sendAttachment('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', '123', 'Google Logo', 'image/png', 'Google Logo', 100);
  };

  const sendMessage = () => {
    vivocha.sendMessage('Hello from React Native');
  };

  const onEventFromAgent = (name: string, id: string, data: Object) => {
    console.log('Received vivocha event from agent:', name, id, data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vivocha React Native Demo App</Text>
      <Text>Status: {status}</Text>
      <Text>Agents: {agents}</Text>
      <Button onPress={createOrOpenContact} title={available ? "Start Chat" : "Unavailable"} disabled={!available} />
      <Button onPress={changeLanguage} title="Change Language" />
      <Button onPress={setRandomTheme} title="Change Theme" />
      <Button onPress={sendMessage} title="Send Message" />
      <Button onPress={sendAttachment} title="Send Attachment" />
      <Button onPress={sendCustomAction} title="Send Custom Action" />
      <Button onPress={closeContact} title="Close Contact" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default App;
