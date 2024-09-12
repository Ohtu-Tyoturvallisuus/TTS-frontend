import { StyleSheet, View, Text } from 'react-native';

import { useState, useEffect } from 'react';

const Main = () => {

  // TODO: uncomment the following part and add correct url

//  const [form, setForm] = useState('')
//  const fetchForm = async () => {
//    const response = await fetch('<url-here>')
//    const json = await response.json()
//
//    setForm(json.form)
//    console.log(form)
//  }
//  useEffect(() => {
//    fetchForm()
//  }, [])

  return (
    <View style={styles.container}>
      <Text>Placeholder text</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Main;