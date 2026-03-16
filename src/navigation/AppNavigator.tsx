import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { PointsExplorerScreen } from '../screens/PointsExplorerScreen';
import { FormulasScreen } from '../screens/FormulasScreen';
import { ClinicalRecordsScreen } from '../screens/ClinicalRecordsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
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
          tabBarActiveTintColor: '#13ec80',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#13ec80',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen
          name="Puntos"
          component={PointsExplorerScreen}
          options={{
            title: 'Explorador de Puntos',
            headerTitle: 'AcuClinic',
          }}
        />
        <Tab.Screen
          name="Fórmulas"
          component={FormulasScreen}
          options={{
            title: 'Fórmulas',
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
