import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { Meridian, MeridianId } from '../types';
import { useTheme } from '../../theme/useTheme';

interface MeridianPickerProps {
  selectedMeridian: MeridianId | null;
  onSelect: (meridian: MeridianId | null) => void;
  availableMeridians: Meridian[];
  label?: string;
  pairValue?: MeridianId | null;
  disabledValues?: MeridianId[];
}

export const MeridianPicker: React.FC<MeridianPickerProps> = ({
  selectedMeridian,
  onSelect,
  availableMeridians,
  label,
  pairValue,
  disabledValues = [],
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (meridianId: MeridianId | null) => {
    onSelect(meridianId);
    setModalVisible(false);
  };

  const selectedName = selectedMeridian
    ? availableMeridians.find(m => m.id === selectedMeridian)?.name || ''
    : '';

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}

      <TouchableOpacity
        style={[styles.pickerButton, { borderColor: theme.border, backgroundColor: theme.card }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pickerText,
            { color: theme.text },
            !selectedMeridian && { color: theme.textSecondary },
          ]}
        >
          {selectedName || 'Canal'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{label}</Text>

            <TouchableOpacity
              style={[
                styles.option,
                { borderBottomColor: theme.border },
                !selectedMeridian && { backgroundColor: theme.surface },
              ]}
              onPress={() => handleSelect(null)}
            >
              <Text style={[styles.optionText, { color: theme.text }]}>--</Text>
            </TouchableOpacity>

            <FlatList
              data={availableMeridians}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isDisabledByPair = pairValue && item.id === pairValue;
                const isDisabledByValues = disabledValues.includes(item.id);
                const isDisabled = isDisabledByPair || isDisabledByValues;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      { borderBottomColor: theme.border },
                      item.id === selectedMeridian && { backgroundColor: theme.surface },
                      isDisabled && styles.optionDisabled,
                    ]}
                    onPress={() => !isDisabled && handleSelect(item.id)}
                    disabled={isDisabled}
                  >
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: item.color, borderColor: theme.text },
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.text },
                        isDisabled && { color: theme.textSecondary },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  optionDisabled: {
    opacity: 0.4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
