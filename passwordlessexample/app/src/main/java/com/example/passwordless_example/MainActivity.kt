package com.example.passwordless_example

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.tv.material3.MaterialTheme
import com.amplifyframework.auth.AuthFactorType
import com.amplifyframework.auth.cognito.options.AWSCognitoAuthSignInOptions
import com.amplifyframework.auth.cognito.options.AuthFlowType
import com.amplifyframework.auth.cognito.result.AWSCognitoAuthSignOutResult
import com.amplifyframework.auth.result.step.AuthSignInStep
import com.amplifyframework.core.Amplify

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val options = AWSCognitoAuthSignInOptions.builder()
                .callingActivity(this)
                .authFlowType(AuthFlowType.USER_AUTH)
                .preferredFirstFactor(AuthFactorType.EMAIL_OTP)
                .build()

            val navController = rememberNavController()
            NavHost(navController = navController, startDestination = "UsernameInput") {
                composable(route = "UsernameInput") {
                    MaterialTheme {
                        EmailSignInScreen { email ->
                            Log.i("AuthQuickstart", "Start sign in")
                            Amplify.Auth.signIn(
                                email,
                                null,
                                options,
                                { result ->
                                    Log.i("AuthQuickstart", result.nextStep.signInStep.toString())
                                    if (result.nextStep.signInStep === AuthSignInStep.CONFIRM_SIGN_IN_WITH_OTP) {
                                        Log.i("AuthQuickstart", "navigate to OtpInput start")
                                    }
                                },
                                { Log.e("AuthQuickstart", "Failed to sign in", it) }
                            )
                            navController.navigate("OtpInput")
                        }
                    }
                }
                composable(route = "OtpInput") {
                    MaterialTheme {
                        OtpInputScreen { otp ->
                            Log.i("AuthQuickstart", "OTP validate start")
                            Amplify.Auth.confirmSignIn(
                                otp,
                                { result ->
                                    Log.i("AuthQuickstart", result.nextStep.signInStep.toString())
                                    if (result.nextStep.signInStep !== AuthSignInStep.DONE) {
                                        Log.e("AuthQuickstart", "Failed to OTP validate")
                                    }
                                },
                                { error ->
                                    Log.e("AuthQuickstart", "Failed to OTP validate", error)
                                }
                            )
                            // Show UI to collect OTP
                            navController.navigate("SignedIn")
                        }
                    }
                }
                composable(route = "SignedIn") {
                    MaterialTheme {
                        SignedInScreen {
                            Log.i("AuthQuickstart", "SignOut start")
                            Amplify.Auth.signOut { signOutResult ->
                                when(signOutResult) {
                                    is AWSCognitoAuthSignOutResult.CompleteSignOut -> {
                                        // Sign Out completed fully and without errors.
                                        Log.i("AuthQuickStart", "Signed out successfully")
                                    }
                                    is AWSCognitoAuthSignOutResult.PartialSignOut -> {
                                        // Sign Out completed with some errors. User is signed out of the device.
                                        signOutResult.hostedUIError?.let {
                                            Log.e("AuthQuickStart", "HostedUI Error", it.exception)
                                            // Optional: Re-launch it.url in a Custom tab to clear Cognito web session.

                                        }
                                        signOutResult.globalSignOutError?.let {
                                            Log.e("AuthQuickStart", "GlobalSignOut Error", it.exception)
                                            // Optional: Use escape hatch to retry revocation of it.accessToken.
                                        }
                                        signOutResult.revokeTokenError?.let {
                                            Log.e("AuthQuickStart", "RevokeToken Error", it.exception)
                                            // Optional: Use escape hatch to retry revocation of it.refreshToken.
                                        }
                                    }
                                    is AWSCognitoAuthSignOutResult.FailedSignOut -> {
                                        // Sign Out failed with an exception, leaving the user signed in.
                                        Log.e("AuthQuickStart", "Sign out Failed", signOutResult.exception)
                                    }
                                }
                            }
                            navController.navigate("UsernameInput")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun EmailSignInScreen(onSignIn: (String) -> Unit) {
    var email by remember { mutableStateOf(TextFieldValue("")) }
    var isEmailValid by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Sign In",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        OutlinedTextField(
            value = email,
            onValueChange = {
                email = it
                isEmailValid = android.util.Patterns.EMAIL_ADDRESS.matcher(it.text).matches()
            },
            label = { Text("Email Address") },
            isError = !isEmailValid,
            singleLine = true,
            modifier = Modifier.fillMaxWidth(0.8f)
        )
        if (!isEmailValid) {
            Text(
                text = "Invalid email address",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 4.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (isEmailValid && email.text.isNotBlank()) {
                    onSignIn(email.text)
                }
            },
            enabled = isEmailValid && email.text.isNotBlank()
        ) {
            Text(text = "Next")
        }
    }
}

@Composable
fun OtpInputScreen(onSignIn: (String) -> Unit) {
    var otp by remember { mutableStateOf(TextFieldValue("")) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Input One Time Password",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        OutlinedTextField(
            value = otp,
            onValueChange = {
                otp = it
            },
            label = { Text("One Time Password") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(0.8f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (otp.text.isNotBlank()) {
                    onSignIn(otp.text)
                }
            },
            enabled = otp.text.isNotBlank()
        ) {
            Text(text = "Sign In")
        }
    }
}

@Composable
fun SignedInScreen(onSignOut: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Button(
            onClick = {
                onSignOut()
            },
            enabled = true
        ) {
            Text(text = "Sign Out")
        }
    }
}
