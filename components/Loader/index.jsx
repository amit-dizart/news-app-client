import React from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'

export default function Loader({ show }) {
  return (
    <Modal
      visible={show}
      transparent
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor : "rgba(0,0,0,0.6)"
        }}
      >
        <ActivityIndicator
          size={"large"}
          color={"orange"}
        />
      </View>
    </Modal>
  )
}
