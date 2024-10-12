/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [todos, setTodo] = useState({judul: '', catatan: ''});
  const [submitedTodo, setSubmitedTodo] = useState([]);
  const [idCounter, setIdCounter] = useState(1);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem('@submitedTodo');
        const savedIdCounter = await AsyncStorage.getItem('@idCounter');
        if (savedTodos !== null) {
          setSubmitedTodo(JSON.parse(savedTodos));
        }
        if (savedIdCounter !== null) {
          setIdCounter(parseInt(savedIdCounter, 10));
        }
      } catch (e) {
        console.error('Gagal memuat data:', e);
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(
          '@submitedTodo',
          JSON.stringify(submitedTodo),
        );
        await AsyncStorage.setItem('@idCounter', idCounter.toString());
      } catch (e) {
        console.error('Gagal menyimpan data:', e);
      }
    };
    saveTodos();
  }, [submitedTodo, idCounter]);

  const onChangeJudul = judul => {
    setTodo(preTodo => ({
      ...preTodo,
      judul: judul,
    }));
  };

  const onChangeCatatan = catatan => {
    setTodo(preTodo => ({
      ...preTodo,
      catatan: catatan,
    }));
  };

  const onSubmitHandler = () => {
    if (todos.judul.trim() === '' && todos.catatan.trim() === '') {
      return;
    }

    setSubmitedTodo(prevSubmitted => [
      ...prevSubmitted,
      {...todos, id: idCounter},
    ]);
    setTodo({judul: '', catatan: ''});
    setIdCounter(idCounter + 1);
  };

  const onDeleteHandler = id => {
    setSubmitedTodo(submitedTodo.filter(todo => todo.id !== id));
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#5588ff'}}>
      <StatusBar backgroundColor="#304bce" />
      <View
        style={{
          backgroundColor: '#304bce',
          paddingVertical: 10,
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 25,
            fontWeight: 800,
            marginLeft: 20,
            fontStyle: 'italic',
          }}>
          Catatan
        </Text>
      </View>
      <View style={{padding: 30}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 28,
            marginBottom: 25,
            fontWeight: 800,
            color: '#fff',
          }}>
          Buat Catatan Baru
        </Text>
        <TextInput
          placeholder="Judul..."
          value={todos.judul}
          onChangeText={onChangeJudul}
          placeholderTextColor="#000"
          style={{
            backgroundColor: '#fff0ff',
            paddingLeft: 15,
            borderRadius: 10,
            color: '#000',
          }}
        />

        <TextInput
          placeholder="Catatan..."
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          placeholderTextColor="#000"
          value={todos.catatan}
          onChangeText={onChangeCatatan}
          style={{
            backgroundColor: '#fff0ff',
            paddingLeft: 15,
            borderRadius: 10,
            marginTop: 10,
            color: '#000',
          }}
        />
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffbbaa',
              paddingVertical: 5,
              borderRadius: 10,
            }}
            onPress={onSubmitHandler}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#0f0f0f',
              }}>
              Buat
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 30}}>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
            }}>
            Catatan anda:
          </Text>
          {submitedTodo.length < 1 ? (
            <Text style={{textAlign: 'center', color: '#000', fontSize: 18}}>
              Tidak Ada Catatan
            </Text>
          ) : (
            submitedTodo.map(todo => (
              <View
                key={todo.id}
                style={{
                  backgroundColor: '#ff5',
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: 16,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#000',
                    borderBottomWidth: 1.5,
                    paddingBottom: 3,
                  }}>
                  {todo.judul}
                </Text>
                <Text
                  style={{
                    marginVertical: 15,
                    fontSize: 16,
                    color: '#000',
                    borderBottomWidth: 1.5,
                    paddingBottom: 10,
                  }}>
                  {todo.catatan}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#5500ff',
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => onDeleteHandler(todo.id)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default App;
