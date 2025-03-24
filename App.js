import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InstagramHome from "./InstagramHome";

export default function App() {

  const stack = createStackNavigator();

  return(
    <NavigationContainer>
      <stack.Navigator initialRouteName="home" screenOptions={{headerShown: false, animation: 'reveal_from_bottom'}}>
        <stack.Screen name="home" component={InstagramHome}/>
        
      </stack.Navigator>
    </NavigationContainer>
  );
}