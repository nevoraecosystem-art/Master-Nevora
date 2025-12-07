import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Slide {
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    title: 'Conheça a Norah Lite',
    description: 'Sua assistente pessoal de IA para organizar a rotina e lembrar do que importa.',
  },
  {
    title: 'Produtividade sem esforço',
    description: 'Liste tarefas, acompanhe hábitos e receba sugestões práticas para o dia.',
  },
  {
    title: 'Companhia para o dia a dia',
    description: 'Converse com a Norah sobre estudos, ideias e como deixar sua vida mais leve.',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLastSlide = useMemo(() => index === slides.length - 1, [index]);

  const goToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleNext = () => {
    if (isLastSlide) {
      goToLogin();
      return;
    }
    const nextIndex = Math.min(index + 1, slides.length - 1);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setIndex(nextIndex);
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={[styles.slide, { width }]}> 
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>✨</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity onPress={goToLogin} style={styles.skip}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.title}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setIndex(slideIndex);
          }}
          renderItem={renderItem}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((_, idx) => (
              <View key={idx} style={[styles.dot, idx === index && styles.dotActive]} />
            ))}
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryText}>{isLastSlide ? 'Criar minha conta' : 'Próximo'}</Text>
          </TouchableOpacity>
          <Text style={styles.subText}>Norah Lite: ideias, lembretes e organização no seu bolso.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    flex: 1,
  },
  skip: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  skipText: {
    color: '#6c7c8d',
    fontWeight: '600',
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emojiCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e8f1f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  emoji: {
    fontSize: 38,
  },
  title: {
    marginTop: 28,
    fontSize: 24,
    fontWeight: '800',
    color: '#102542',
    textAlign: 'center',
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    color: '#4a5c6b',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4dce4',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#1b4b66',
  },
  primaryButton: {
    backgroundColor: '#1b4b66',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  subText: {
    textAlign: 'center',
    color: '#6c7c8d',
  },
});

export default OnboardingScreen;
// implementado na Etapa 2
