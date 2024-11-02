import { View } from "react-native";
import MicrosoftSignIn from "./MicrosoftSignIn";
import SignIn from "./SignIn";

const CombinedSignIn = () => {
  return (
    <View className="flex-1 justify-center items-center px-5">
      <MicrosoftSignIn />
      <SignIn />
    </View>
  );
};

export default CombinedSignIn;