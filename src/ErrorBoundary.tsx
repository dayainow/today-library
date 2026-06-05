import React, { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.card}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.title}>앱을 불러오지 못했어요</Text>
          <Text style={styles.message}>
            일시적인 문제가 발생했습니다.{'\n'}아래 버튼을 눌러 다시 시도해 주세요.
          </Text>
          {__DEV__ ? (
            <Text style={styles.devError}>{error.message}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={this.reset}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>다시 시도</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: '#f7f8fb',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    width: '100%',
  },
  iconBadge: {
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 18,
    width: 56,
  },
  iconText: {
    color: '#dc2626',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  title: {
    color: '#0b1220',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  devError: {
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    color: '#92400e',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 28,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
