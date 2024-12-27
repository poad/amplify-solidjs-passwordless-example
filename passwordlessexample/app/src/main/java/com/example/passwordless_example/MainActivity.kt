package com.example.passwordless_example

import android.app.Activity
import android.os.Bundle
import android.util.Log
import android.util.Patterns
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
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
import kotlinx.coroutines.launch
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavController
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            AppNavigation(this)
        }
    }
}

// SignInState to manage UI states
sealed class SignInState {
    data object Initial : SignInState()
    data object Loading : SignInState()
    data object Otp : SignInState()
    data object LoadingOtp : SignInState()
    data object Success : SignInState()
    data class Error(val message: String) : SignInState()
}

// ViewModel for handling sign-in logic
class SignInViewModel : ViewModel() {
    private val _signInState = MutableStateFlow<SignInState>(SignInState.Initial)
    val signInState = _signInState.asStateFlow()

    fun signIn(email: String, activity: Activity) {
        viewModelScope.launch {
            _signInState.value = SignInState.Loading
            try {
                val options = AWSCognitoAuthSignInOptions.builder()
                    .callingActivity(activity)
                    .authFlowType(AuthFlowType.USER_AUTH)
                    .preferredFirstFactor(AuthFactorType.EMAIL_OTP)
                    .build()

                Log.i("AuthQuickstart", "Start sign in")
                Amplify.Auth.signIn(
                    email,
                    null,
                    options,
                    { result ->
                        Log.i("AuthQuickstart", result.nextStep.signInStep.toString())
                        _signInState.value = SignInState.Otp
                    },
                    { Log.e("AuthQuickstart", "Failed to sign in", it) }
                )
            } catch (e: Exception) {
                _signInState.value = SignInState.Error(e.message ?: "Unknown error")
            }
        }
    }

    fun confirmSignIn(otp: String) {
        viewModelScope.launch {
            _signInState.value = SignInState.LoadingOtp
            try {
                Log.i("AuthQuickstart", "OTP validate start")
                Amplify.Auth.confirmSignIn(
                    otp,
                    { result ->
                        Log.i("AuthQuickstart", result.nextStep.signInStep.toString())
                        if (result.nextStep.signInStep !== AuthSignInStep.DONE) {
                            Log.e("AuthQuickstart", "Failed to OTP validate")
                        } else {
                            _signInState.value = SignInState.Success
                        }
                    },
                    { error ->
                        Log.e("AuthQuickstart", "Failed to OTP validate", error)
                    }
                )
            } catch (e: Exception) {
                _signInState.value = SignInState.Error(e.message ?: "Unknown error")
            }
        }
    }

    fun signOut() {
        Log.i("AuthQuickstart", "SignOut start")
        Amplify.Auth.signOut { signOutResult ->
            when(signOutResult) {
                is AWSCognitoAuthSignOutResult.CompleteSignOut -> {
                    // Sign Out completed fully and without errors.
                    Log.i("AuthQuickStart", "Signed out successfully")
                    _signInState.value = SignInState.Initial
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

    }
}

// Navigation destinations
sealed class Screen(val route: String) {
    data object SignIn : Screen("signIn")
    data object Otp : Screen("otp")
    data object Home : Screen("home")
}

@Composable
fun AppNavigation(activity: Activity) {
    val navController = rememberNavController()
    val viewModel = remember { SignInViewModel() }

    NavHost(navController = navController, startDestination = Screen.SignIn.route) {
        composable(Screen.SignIn.route) {
            MaterialTheme {
                SignInScreen(activity, viewModel, navController)
            }
        }
        composable(Screen.Otp.route) {
            MaterialTheme {
                OtpInputScreen(viewModel, navController)
            }
        }
        composable(Screen.Home.route) {
            MaterialTheme {
                HomeScreen(viewModel, navController)
            }
        }
    }
}

@Composable
fun SignInScreen(
    activity: Activity,
    viewModel: SignInViewModel,
    navController: NavController
) {
    var email by remember { mutableStateOf("") }
    var isEmailValid by remember { mutableStateOf(true) }

    val signInState by viewModel.signInState.collectAsState()

    LaunchedEffect(signInState) {
        if (signInState is SignInState.Otp) {
            navController.navigate(Screen.Otp.route) {
                popUpTo(Screen.SignIn.route) { inclusive = true }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Sign In",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp),
            color = MaterialTheme.colorScheme.onPrimary,
        )

        TextField(
            value = email,
            onValueChange = {
                email = it
                isEmailValid = Patterns.EMAIL_ADDRESS.matcher(it).matches()
            },
            label = { Text("Email") },
            isError = !isEmailValid,
            singleLine = true,
            modifier = Modifier.fillMaxWidth(0.8f)
        )

        Spacer(modifier = Modifier.height(8.dp))

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
                if (isEmailValid && email.isNotBlank()) {
                    viewModel.signIn(email, activity)
                }
                      },
            enabled = signInState !is SignInState.Loading,
            modifier = Modifier.fillMaxWidth()
        ) {
            if (signInState is SignInState.Loading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Sign In")
            }
        }

        if (signInState is SignInState.Error) {
            Text(
                text = (signInState as SignInState.Error).message,
                color = MaterialTheme.colorScheme.error
            )
        }
    }
}

@Composable
fun OtpInputScreen(
    viewModel: SignInViewModel,
    navController: NavController
) {
    var otp by remember { mutableStateOf(TextFieldValue("")) }

    val signInState by viewModel.signInState.collectAsState()

    LaunchedEffect(signInState) {
        if (signInState is SignInState.Success) {
            navController.navigate(Screen.Home.route) {
                popUpTo(Screen.SignIn.route) { inclusive = true }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Input One Time Password",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp),
            color = MaterialTheme.colorScheme.onPrimary,
        )

        TextField(
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
                viewModel.confirmSignIn(otp.text)
            },
            enabled = otp.text.isNotBlank() && signInState !is SignInState.LoadingOtp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Sign In")
        }
    }
}

@Composable
fun HomeScreen(
    viewModel: SignInViewModel,
    navController: NavController
) {
    val signInState by viewModel.signInState.collectAsState()

    LaunchedEffect(signInState) {
        if (signInState is SignInState.Initial) {
            navController.navigate(Screen.SignIn.route) {
                popUpTo(Screen.SignIn.route) { inclusive = true }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Button(
            onClick = {
                viewModel.signOut()
            },
            enabled = true,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Sign Out")
        }
    }
}
