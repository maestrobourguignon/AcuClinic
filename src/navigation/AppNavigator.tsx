import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { PointsExplorerScreen } from '../screens/PointsExplorerScreen';
import { FormulasScreen } from '../screens/FormulasScreen';
import { ClinicalRecordsScreen } from '../screens/ClinicalRecordsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { useTheme, useThemeMode } from '../theme/useTheme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const theme = useTheme();
  const { isDark, toggle } = useThemeMode();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Puntos':
                iconName = focused ? 'locate' : 'locate-outline';
                break;
              case 'Fórmulas':
                iconName = focused ? 'medical' : 'medical-outline';
                break;
              case 'Pacientes':
                iconName = focused ? 'people' : 'people-outline';
                break;
              case 'Agenda':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              default:
                iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.text,
          },
          headerRight: () => (
            <TouchableOpacity onPress={toggle} style={{ padding: 12 }}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={theme.headerText} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.headerText,
          },
        })}
      >
        <Tab.Screen
          name="Puntos"
          component={PointsExplorerScreen}
          options={{
            title: 'Explorador de Puntos',
            headerTitle: 'Explorador de Puntos',
          }}
        />
        <Tab.Screen
          name="Fórmulas"
          component={FormulasScreen}
          options={{
            title: 'Fórmulas de Tratamiento',
          }}
        />
        <Tab.Screen
          name="Pacientes"
          component={ClinicalRecordsScreen}
          options={{
            title: 'Historias Clínicas',
          }}
        />
        <Tab.Screen
          name="Agenda"
          component={ScheduleScreen}
          options={{
            title: 'Agenda',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
