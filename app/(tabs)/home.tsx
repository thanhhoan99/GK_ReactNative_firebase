import { View, Text } from 'react-native'
import React from 'react'
import MenuList from '../../components/Home/MenuList'

export default function home() {
  return (
    <View style={{ padding:20  }}>
      <Text  style={{fontSize:35 }}>APP </Text>
         <MenuList/>
    </View>
  )
}