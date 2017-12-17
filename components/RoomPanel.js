/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet,
  TouchableWithoutFeedback, Platform, UIManager, LayoutAnimation } from 'react-native';

const I18n = require('../i18n/i18n');

const RoomPanelCard = require('./RoomPanelCard');
const CloseButton = require('./CloseButton');

type PropsType = {
  fullscreenToggle: () => null, // toggles parent's fullscreen view
  totalHeight: number,
  roomConfig: Object,
  showRoomName?: boolean,
  active: number
};

type StateType = {
  selectedCard: number,
};

class Room extends React.Component<PropsType, StateType> {
  state = {
    selectedCard: -1,
  };

  static defaultProps = {
    showRoomName: false,
    active: true
  };

  _last_scroll_y = 0;

  componentWillMount() {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  handleScroll(event: Object) {
    if (this.state.selectedCard === -1) {
      this._last_scroll_y = event.nativeEvent.contentOffset.y;
    }
  }

  onPanelSelected(panelIndex: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.props.fullscreenToggle();
    this.setState({selectedCard: panelIndex});
    if (panelIndex !== -1) {
      requestAnimationFrame((() => {
        this.refs.scrollView.scrollTo({x: 0, y: 210*panelIndex, animated: true});
      }).bind(this));
    } else {
      this.refs.scrollView.scrollTo({x: 0, y: this._last_scroll_y, animated: true});
    }
  }

  render() {
    const { selectedCard } = this.state;
    const { roomConfig, showRoomName, active, totalHeight } = this.props;

    var header;
    if (showRoomName && selectedCard === -1) {
      header = (
        <View style={styles.header}>
          <Text style={styles.header_text}>
            {I18n.t(roomConfig.name.en)}
          </Text>
        </View>
      )
    }

    /* create room control panels */
    var panels = [];
    for (var i = 0; i < roomConfig.grid.length; i++) {
      for (var j = 0; j < roomConfig.grid[i].panels.length; j++) {
        const panel = roomConfig.grid[i].panels[j];
        const panelIndex = i*roomConfig.grid.length+j;

        var panelLayoutStyle = {
          width: '100%',
          height: 200,
        };
        if (panelIndex === selectedCard)
          panelLayoutStyle.height = totalHeight - 70;

        panels.push(
          <TouchableWithoutFeedback
            key={'panel-' + panel.name.en + '-' + roomConfig.name.en}
            onPress={(selectedCard === -1 && active) ? (() => this.onPanelSelected(panelIndex)).bind(this) : null}>
            <View style={[panelLayoutStyle, styles.room_panel]}>
              <RoomPanelCard
                viewType={panelIndex === selectedCard ? 'detail' : 'collapsed'}
                roomConfig={roomConfig}
                panel={panel} />
            </View>
          </TouchableWithoutFeedback>
        );

        if (panelIndex === selectedCard)
          panels.push(
            <View key={"panel-close-button"}
              style={styles.close_button}>
              <CloseButton onPress={(() => this.onPanelSelected(-1)).bind(this)} />
            </View>
          );
      }
    }

    return (
      <View style={[styles.container, {opacity: (active) ? 1 : 1}]}>
        {header}
        <ScrollView
          ref={"scrollView"}
          scrollEventThrottle={100}
          onScroll={this.handleScroll.bind(this)}
          scrollEnabled={active && selectedCard === -1}
          showsVerticalScrollIndicator={false}
          style={styles.scroll_view}>
          {panels}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  room_panel: {
    marginTop: 5,
    marginBottom: 5,
  },
  scroll_view: {
    paddingTop: 5,
  },
  header: {
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  header_text: {
    fontFamily: 'CeraPRO-Bold',
    color: '#FFFFFF',
    fontSize: 27,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  close_button: {
    width: '100%',
    height: 40,
    marginTop: 5,
    marginBottom: 5,
  }
});

module.exports = Room;
