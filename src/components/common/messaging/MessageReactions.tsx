import {useContext} from 'react';
import {Pressable, View} from 'react-native';
import {action} from 'mobx';
import {observer} from 'mobx-react-lite';

import type {Message} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Text} from '@clerotri/components/common/atoms';
import {Image} from '@clerotri/crossplat/Image';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

type ReactionPile = {
  emoji: string;
  reactors: string[];
};

export const MessageReactions = observer(
  ({msg, reactions}: {msg: Message; reactions: ReactionPile[]}) => {
    const {currentTheme} = useContext(ThemeContext);

    if (reactions.length > 0) {
      return (
        <View
          style={{
            flexDirection: 'row',
            marginVertical: commonValues.sizes.small,
            flexWrap: 'wrap',
          }}>
          {reactions.map(r => {
            return (
              <Pressable
                key={`message-${msg._id}-reaction-${r.emoji}`}
                onPress={action(() => {
                  msg.channel?.havePermission('React')
                    ? !r.reactors.includes(client.user?._id!)
                      ? msg.react(r.emoji)
                      : msg.unreact(r.emoji)
                    : showToast('You cannot react to this message.');
                })}
                onLongPress={action(() => {
                  app.openViewReactions(msg, r.emoji);
                })}
                style={{
                  padding: commonValues.sizes.small,
                  borderRadius: commonValues.sizes.small,
                  borderColor: r.reactors.includes(client.user?._id!)
                    ? currentTheme.accentColor
                    : currentTheme.backgroundTertiary,
                  backgroundColor: currentTheme.backgroundSecondary,
                  borderWidth: commonValues.sizes.xs,
                  marginEnd: commonValues.sizes.small,
                  marginVertical: commonValues.sizes.xs,
                }}>
                <View style={{flexDirection: 'row'}}>
                  {r.emoji.length > 6 && (
                    <Image
                      style={{minHeight: 15, minWidth: 15}}
                      source={{
                        uri: `${client.configuration?.features.autumn.url}/emojis/${r.emoji}`,
                      }}
                    />
                  )}
                  <Text key={`message-${msg._id}-reaction-${r.emoji}-label`}>
                    {r.emoji.length <= 6 && r.emoji} {r.reactors.length}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    }
    return <></>;
  },
);
