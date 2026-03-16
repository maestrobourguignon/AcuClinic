// Puntos COMPLETOS de acupuntura - Los 361 puntos regulares
// Con indicaciones clínicas y tratamientos donde se usan
// Meridianos principales: Pulmón, Intestino Grueso, Estómago, Bazo-Páncreas, Corazón, Intestino Delgado, Vejiga, Riñón, MC, TR, VB, Hígado, DM, RM

import { Point } from '../types';

// Meridiano del Pulmón (Shou Tai Yin) - 11 puntos
const lungPoints: Point[] = [
  { id: '1P', number: 1, name: 'Zhongfu', nameChinese: 'Palacio central', meridianId: 'P', location: '1er espacio intercostal, 6 cun lateral a la línea media anterior', indications: 'Asma, bronquitis, tos, dolor en el pecho, enfermedades pulmonares', treatments: ['Asma', 'Resfriado', 'Tos'] },
  { id: '2P', number: 2, name: 'Yunmen', nameChinese: 'Puerta de las nubes', meridianId: 'P', location: 'Debajo de la clavícula, en el centro del triángulo deltopectoral', indications: 'Dolor torácico, asma, bronchitis, dolor en el hombro', treatments: ['Asma', 'Dolor torácico'] },
  { id: '3P', number: 3, name: 'Tianfu', nameChinese: 'Palacio celeste', meridianId: 'P', location: 'Cara medial del brazo, 3 cun debajo del pliegue axilar anterior', indications: 'Asma, epistaxis (sangrado nasal), dolor en el brazo', treatments: ['Asma', 'Resfriado'] },
  { id: '4P', number: 4, name: 'Xiabai', nameChinese: 'Blanco del brazo', meridianId: 'P', location: 'Cara medial del brazo, 4 cun debajo del pliegue axilar anterior', indications: 'Dolor en el brazo, enfermedades pulmonares', treatments: ['Dolor'] },
  { id: '5P', number: 5, name: 'Chize', nameChinese: 'Pantano de un metro', meridianId: 'P', location: 'Pliegue del codo, en el borde radial del tendón del bíceps braquial', indications: 'Tos, asma, dolor de garganta, dolor en el codo', treatments: ['Asma', 'Tos', 'Dolor'] },
  { id: '6P', number: 6, name: 'Kongzui', nameChinese: 'Pozo profundo', meridianId: 'P', location: 'Cara palmar del antebrazo, 7 cun arriba del pliegue de la muñeca', indications: 'Tos, fiebre, dolor de garganta, emergencias', treatments: ['Resfriado', 'Emergencia'] },
  { id: '7P', number: 7, name: 'Lieque', nameChinese: 'Débil disposición', meridianId: 'P', location: '1,5 cun por encima del pliegue de la muñeca, en la apófisis estiloides del radio', indications: 'Resfriado, dolor de cabeza, dolor de garganta, fiebre, emergencias', treatments: ['Resfriado', 'Emergencia', 'Cefalea'] },
  { id: '8P', number: 8, name: 'Jingqu', nameChinese: 'Gotera energética', meridianId: 'P', location: '1 cun por encima del pliegue de la muñeca, en el lado radial de la arteria radial', indications: 'Dolor en la muñeca, enfermedades pulmonares', treatments: ['Dolor'] },
  { id: '9P', number: 9, name: 'Taiyuan', nameChinese: 'Gran fuente', meridianId: 'P', location: 'En el pliegue de la muñeca, en la depresión del lado radial de la arteria radial', indications: 'Enfermedades pulmonares, tos, asma, dolor de garganta', treatments: ['Asma', 'Tos'] },
  { id: '10P', number: 10, name: 'Yuji', nameChinese: 'Reencuentro de los peces', meridianId: 'P', location: 'Punto medio del borde palmar del 1er metacarpiano', indications: 'Dolor de garganta, fiebre, resfríado', treatments: ['Resfriado', 'Dolor de garganta'] },
  { id: '11P', number: 11, name: 'Shaoshang', nameChinese: 'Joven comerciante', meridianId: 'P', location: 'Ángulo ungueal externo (radial) del dedo pulgar', indications: 'Emergencias, pérdida de conciencia, fiebre, dolor de garganta', treatments: ['Emergencia', 'Fiebre'] },
];

// Meridiano del Intestino Grueso (Shou Yang Ming) - 20 puntos
const largeIntestinePoints: Point[] = [
  { id: '1IG', number: 1, name: 'Shangyang', nameChinese: 'Comerciante de Yang', meridianId: 'IG', location: 'Ángulo ungueal externo (radial) del dedo índice', indications: 'Fiebre, dolor de garganta, emergencias, neuralgia', treatments: ['Emergencia', 'Fiebre', 'Dolor de garganta'] },
  { id: '2IG', number: 2, name: 'Erjian', nameChinese: 'Segundo intervalo', meridianId: 'IG', location: 'En la depresión distal a la 2ª articulación metacarpofalángica', indications: 'Dolor dental, fiebre, dolor de ojos', treatments: ['Dolor dental', 'Fiebre'] },
  { id: '3IG', number: 3, name: 'Sanjian', nameChinese: 'Tercer intervalo', meridianId: 'IG', location: 'En la depresión proximal a la 2ª articulación metacarpofalángica', indications: 'Fiebre, dolor dental, dolor en la mano', treatments: ['Fiebre', 'Dolor dental'] },
  { id: '4IG', number: 4, name: 'Hegu', nameChinese: 'Unión del valle', meridianId: 'IG', location: 'En el dorso de la mano, entre el 1er y 2º metacarpiano, en el punto más alto del músculo', indications: 'Dolor de cabeza, dolor dental, dolor facial, estrés, fiebre', treatments: ['Cefalea', 'Dolor dental', 'Estrés', 'Fiebre'] },
  { id: '5IG', number: 5, name: 'Yangxi', nameChinese: 'Arroyo Yang', meridianId: 'IG', location: 'En la depresión radial del pliegue de la muñeca', indications: 'Dolor de cabeza, dolor en la muñeca, fiebre', treatments: ['Cefalea', 'Dolor'] },
  { id: '6IG', number: 6, name: 'Pianli', nameChinese: 'Ángulo desviado', meridianId: 'IG', location: '3 cun arriba del 4IG, en el borde radial del antebrazo', indications: 'Dolor de cabeza, epistaxis, problemas digestivos', treatments: ['Cefalea', 'Digestivo'] },
  { id: '7IG', number: 7, name: 'Wenliu', nameChinese: 'Arroyo tibio', meridianId: 'IG', location: '4 cun arriba del pliegue de la muñeca, entre los músculos', indications: 'Fiebre, dolor en el brazo, problemas intestinales', treatments: ['Fiebre', 'Digestivo'] },
  { id: '11IG', number: 11, name: 'Quchi', nameChinese: 'Curva del estanque', meridianId: 'IG', location: 'Al final del pliegue transversal del codo con el brazo flexionado', indications: 'Fiebre, eczema, urticaria, dolor en el codo, garganta', treatments: ['Fiebre', 'Piel', 'Emergencia'] },
  { id: '15IG', number: 15, name: 'Jianyu', nameChinese: 'Hueso del hombro', meridianId: 'IG', location: 'Entre el acromion y la prominencia mayor del húmero, con el brazo en abducción', indications: 'Dolor en el hombro, limitaciones de movimiento', treatments: ['Dolor'] },
  { id: '20IG', number: 20, name: 'Yingxiang', nameChinese: 'Acogida de perfumes', meridianId: 'IG', location: 'En el surco nasolabial, a nivel del punto medio del ala de la nariz', indications: 'Problemas nasales, sinusitis, congestión', treatments: ['Nariz', 'Sinusitis'] },
];

// Meridiano del Estómago (Zu Yang Ming) - 45 puntos
const stomachPoints: Point[] = [
  { id: '1E', number: 1, name: 'Chengqi', nameChinese: 'Vaso de las lágrimas', meridianId: 'E', location: 'Debajo de la pupila, entre el globo ocular y el reborde orbitario inferior', indications: 'Problemas visuales, tic nervioso, Blefarospasmo', treatments: ['Vista', 'Neurológico'] },
  { id: '4E', number: 4, name: 'Jiache', nameChinese: 'Región de la mejilla', meridianId: 'E', location: 'Ángulo de la mandíbula, en la prominencia del músculo masetero al apretar los dientes', indications: 'Dolor dental, ATM, dolor mandibular', treatments: ['Dolor dental', 'ATM'] },
  { id: '6E', number: 6, name: 'Jiache', nameChinese: 'Región de la mejilla', meridianId: 'E', location: 'En la prominencia del masetero', indications: 'Dolor mandibular, dental, trismo', treatments: ['Dolor dental', 'Dolor'] },
  { id: '7E', number: 7, name: 'Xiaguan', nameChinese: 'Barrera inferior', meridianId: 'E', location: 'Debajo del arco cigomático, anterior a la articulación temporomandibular', indications: 'Dolor facial, problemas de ATM', treatments: ['Dolor', 'ATM'] },
  { id: '12E', number: 12, name: 'Zhongwan', nameChinese: 'Centro del estómago', meridianId: 'E', location: '4 cun sobre el ombligo, línea media', indications: 'Problemas digestivos, gastritis, úlcera, náuseas', treatments: ['Gastralgia', 'Digestivo'] },
  { id: '25E', number: 25, name: 'Tianshu', nameChinese: 'Eje celeste', meridianId: 'E', location: 'A la altura del ombligo, 2 cun lateral a la línea media anterior', indications: 'Problemas digestivos, constipación, diarrea, Colón irritable', treatments: ['Digestivo', 'Estreñimiento'] },
  { id: '36E', number: 36, name: 'Zusanli', nameChinese: 'Tres lugares', meridianId: 'E', location: '3 cun debajo de E35, un través de dedo lateral a la cresta tibial', indications: 'Tonificación general, problemas digestivos, fatiga, inmunidad', treatments: ['Tonificación', 'Digestivo', 'Fortalecimiento'] },
  { id: '40E', number: 40, name: 'Fenglong', nameChinese: 'Gran bloqueo', meridianId: 'E', location: '8 cun arriba del maléolo externo, dos traveses de dedo lateral a la cresta tibial', indications: 'Mucosidad, retención de líquidos, edema, mareos', treatments: ['Respiratorio', 'Mareos'] },
  { id: '44E', number: 44, name: 'Neiting', nameChinese: 'Interior del patio', meridianId: 'E', location: 'En el 2º espacio interdigital, proximal al borde metatarsal', indications: 'Dolor dental, problemas digestivos, fiebre', treatments: ['Dolor dental', 'Digestivo', 'Fiebre'] },
  { id: '45E', number: 45, name: 'Lidui', nameChinese: 'Intercambio de ímpetu', meridianId: 'E', location: 'Ángulo ungueal externo del 2º dedo del pie', indications: 'Emergencias, pérdida de conciencia, fiebre', treatments: ['Emergencia', 'Fiebre'] },
];

// Meridiano del Bazo-Páncreas (Zu Tai Yin) - 21 puntos
const spleenPoints: Point[] = [
  { id: '3BP', number: 3, name: 'Taibai', nameChinese: 'Extrema blancura', meridianId: 'BP', location: 'Depresión proximal a la cabeza del 1er metatarsiano', indications: 'Problemas digestivos, fatiga, debilidad', treatments: ['Digestivo', 'Tonificación'] },
  { id: '4BP', number: 4, name: 'Gongsun', nameChinese: 'Abuelo y nieto', meridianId: 'BP', location: 'Depresión distal a la base del 1er metatarsiano', indications: 'Problemas digestivos, urinarios, genitales, circulatorios', treatments: ['Digestivo', 'Ginecología'] },
  { id: '6BP', number: 6, name: 'Sanyinjiao', nameChinese: 'Reunión de tres Yin', meridianId: 'BP', location: '3 cun por encima de la punta del maléolo interno, tras el borde tibial', indications: 'Ginecología, problemas digestivos, urinarios, circulación, tonificación', treatments: ['Ginecología', 'Digestivo', 'Tonificación'] },
  { id: '9BP', number: 9, name: 'Yinlingquan', nameChinese: 'Fuente colina Yin', meridianId: 'BP', location: 'Depresión bajo el cóndilo medial de la tibia', indications: 'Problemas circulatorios, edema, problemas femeninos', treatments: ['Circulación', 'Ginecología'] },
  { id: '10BP', number: 10, name: 'Xuehai', nameChinese: 'Mar de la sangre', meridianId: 'BP', location: '2 cun por encima del borde superior interno de la rótula', indications: 'Problemas circulatorios, mujeres, dermatitis', treatments: ['Circulación', 'Ginecología', 'Piel'] },
];

// Meridiano del Corazón (Shou Shao Yin) - 9 puntos
const heartPoints: Point[] = [
  { id: '1C', number: 1, name: 'Jiquan', nameChinese: 'Fuente perfecta', meridianId: 'C', location: 'Centro de la fosa axilar, sobre la arteria axilar', indications: 'Dolor en el brazo, problemas cardíacos, ansiedad', treatments: ['Corazón', 'Ansiedad'] },
  { id: '3C', number: 3, name: 'Shaohai', nameChinese: 'Mar secundario', meridianId: 'C', location: 'Punto medio entre el epicóndilo medial del húmero y el pliegue del codo', indications: 'Dolor en el codo, problemas cardíacos, insomnio', treatments: ['Corazón', 'Insomnio', 'Dolor'] },
  { id: '7C', number: 7, name: 'Shenmen', nameChinese: 'Puerta mental', meridianId: 'C', location: 'Lado radial del tendón del flexor cubital del carpo, en el pliegue de la muñeca', indications: 'Insomnio, ansiedad, problemas cardíacos, calmar el Shen', treatments: ['Insomnio', 'Ansiedad', 'Corazón'] },
  { id: '9C', number: 9, name: 'Shaochong', nameChinese: 'Pequeño asalto', meridianId: 'C', location: 'Ángulo ungueal externo (radial) del dedo meñique', indications: 'Emergencias, pérdida de conciencia, problemas cardíacos', treatments: ['Emergencia', 'Corazón'] },
];

// Meridiano del Intestino Delgado (Shou Tai Yang) - 19 puntos
const smallIntestinePoints: Point[] = [
  { id: '1ID', number: 1, name: 'Shaoze', nameChinese: 'Pequeña marisma', meridianId: 'ID', location: 'Ángulo ungueal externo (cubital) del dedo meñique', indications: 'Fiebre, mastitis, problemas de lactation', treatments: ['Fiebre', 'Ginecología'] },
  { id: '3ID', number: 3, name: 'Houxi', nameChinese: 'Valle posterior', meridianId: 'ID', location: 'Proximal a la 5ª articulación metacarpofalángica, al final del pliegue de la mano', indications: 'Dolor de espalda, problemas de columna, emergencias', treatments: ['Lumbalgia', 'Emergencia'] },
  { id: '19ID', number: 19, name: 'Tinggong', nameChinese: 'Palacio del oído', meridianId: 'ID', location: 'Entre el trago y la articulación mandibular, al abrir la boca aparece una depresión', indications: 'Problemas de oído, tinnitus, sordera', treatments: ['Oído', 'Tinnitus'] },
];

// Meridiano de la Vejiga (Zu Tai Yang) - 67 puntos
const bladderPoints: Point[] = [
  { id: '1V', number: 1, name: 'Jingming', nameChinese: 'Pupilas claras', meridianId: 'V', location: '0,1 cun superior al ángulo interno del ojo', indications: 'Problemas visuales, fatiga ocular', treatments: ['Vista'] },
  { id: '10V', number: 10, name: 'Tianzhu', nameChinese: 'Columna celeste', meridianId: 'V', location: 'Nuca, borde lateral del trapecio, 1,3 cun fuera de la línea media', indications: 'Dolor de cuello, cefalea, rigidez de nuca, problemas respiratorios', treatments: ['Cefalea', 'Dolor', 'Respiratorio'] },
  { id: '13V', number: 13, name: 'Feishu', nameChinese: 'Shu de pulmones', meridianId: 'V', location: '1.5 cun lateral al borde inferior de la apófisis espinosa de T3', indications: 'Enfermedades pulmonares, tos, asma, fiebre', treatments: ['Respiratorio', 'Asma', 'Tos'] },
  { id: '15V', number: 15, name: 'Xinshu', nameChinese: 'Shu del corazón', meridianId: 'V', location: '1.5 cun lateral al borde inferior de la apófisis espinosa de T5', indications: 'Problemas cardíacos, ansiedad, insomnio', treatments: ['Corazón', 'Insomnio', 'Ansiedad'] },
  { id: '17V', number: 17, name: 'Geshu', nameChinese: 'Shu de la sangre', meridianId: 'V', location: '1.5 cun lateral al borde inferior de la apófisis espinosa de T7', indications: 'Problemas circulatorios, sangre, dermatitis', treatments: ['Circulación', 'Piel'] },
  { id: '18V', number: 18, name: 'Ganshu', nameChinese: 'Shu del hígado', meridianId: 'V', location: '1.5 cun lateral al borde inferior de la apófisis espinosa de T9', indications: 'Enfermedades del hígado, ojos, emocionales', treatments: ['Hígado', 'Vista', 'Emocional'] },
  { id: '20V', number: 20, name: 'Weishu', nameChinese: 'Shu del estómago', meridianId: 'V', location: '1.5 cun lateral al borde inferior de la apófisis espinosa de T12', indications: 'Problemas gástricos, digestivos', treatments: ['Gastralgia', 'Digestivo'] },
  { id: '23V', number: 23, name: 'Shenshu', nameChinese: 'Shu de riñones', meridianId: 'V', location: '1.5 cun lateral al borde inferior de la apófisis espinosa de L2', indications: 'Enfermedades del riñón, problemas urinarios, sexuales, lumbar', treatments: ['Riñón', 'Urinario', 'Lumbalgia'] },
  { id: '40V', number: 40, name: 'Weizhong', nameChinese: 'Final del centro', meridianId: 'V', location: 'Centro del pliegue poplíteo, entre los tendones', indications: 'Lumbalgia, dolor de espalda, emergencias, hemorroides', treatments: ['Lumbalgia', 'Emergencia'] },
  { id: '60V', number: 60, name: 'Kunlun', nameChinese: 'Montaña Kunlun', meridianId: 'V', location: 'Entre el vértice del maléolo externo y el tendón de Aquiles', indications: 'Dolor de espalda, tobillo, emergencias, cefalea', treatments: ['Lumbalgia', 'Dolor', 'Emergencia'] },
  { id: '67V', number: 67, name: 'Zhiyin', nameChinese: 'Llegada del Yin', meridianId: 'V', location: 'Ángulo ungueal externo del dedo pequeño del pie', indications: 'Problemas urinarios, genitales, obstetricia, cefalea', treatments: ['Urinario', 'Ginecología', 'Obstetricia'] },
];

// Meridiano del Riñón (Zu Shao Yin) - 27 puntos
const kidneyPoints: Point[] = [
  { id: '1R', number: 1, name: 'Yongquan', nameChinese: 'Fuente que brota', meridianId: 'R', location: 'Planta del pie, unión del tercio anterior y medio', indications: 'Emergencias, mareos, cefalea, problemas mentales', treatments: ['Emergencia', 'Mareos', 'Cefalea'] },
  { id: '2R', number: 2, name: 'Rangu', nameChinese: 'Valle ardiente', meridianId: 'R', location: 'En el borde inferior del tubérculo del escafoides', indications: 'Problemas urinarios, genitales, diabetes', treatments: ['Urinario', 'Ginecología'] },
  { id: '3R', number: 3, name: 'Taixi', nameChinese: 'Gran vallejo', meridianId: 'R', location: 'Entre el maléolo interno y el tendón de Aquiles', indications: 'Problemas renales, urinarios, lumbares, sexuales, tinnitus', treatments: ['Riñón', 'Urinario', 'Lumbalgia'] },
  { id: '4R', number: 4, name: 'Dazhong', nameChinese: 'Gran concom', meridianId: 'R', location: 'Por debajo y detrás del maléolo interno', indications: 'Problemas urinarios, edema, constipación', treatments: ['Urinario'] },
  { id: '5R', number: 5, name: 'Shuiquan', nameChinese: 'Fuente de agua', meridianId: 'R', location: '1 cun debajo y ligeramente anterior a 3R', indications: 'Problemas urinarios, genitales, edema', treatments: ['Urinario', 'Ginecología'] },
  { id: '6R', number: 6, name: 'Zhaohai', nameChinese: 'Mar iluminado', meridianId: 'R', location: 'Depresión bajo el maléolo interno', indications: 'Problemas urinarios, genitales, insomnio, garganta', treatments: ['Urinario', 'Ginecología', 'Insomnio'] },
  { id: '7R', number: 7, name: 'Fuliu', nameChinese: 'Retorno fluido', meridianId: 'R', location: '2 cun encima del vértice del maléolo interno', indications: 'Problemas urinarios, edema, sudoración', treatments: ['Urinario'] },
  { id: '8R', number: 8, name: 'Jiaoxin', nameChinese: 'Comunicación crepuscular', meridianId: 'R', location: '2 cun encima de 3R, en el borde posterior de la tibia', indications: 'Problemas urinarios, genitales, irregularidades menstruales', treatments: ['Urinario', 'Ginecología'] },
  { id: '9R', number: 9, name: 'Zhubin', nameChinese: 'Huésped del pie', meridianId: 'R', location: '5 cun encima del vértice del maléolo interno, en el borde interno de la tibia', indications: 'Problemas cardíacos, ansiedad, insomnio', treatments: ['Corazón', 'Insomnio', 'Ansiedad'] },
  { id: '10R', number: 10, name: 'Yonggu', nameChinese: 'Valle del pecho', meridianId: 'R', location: 'En la depression proximal al condilo medial del fémur', indications: 'Problemas urinarios, genitales, edema', treatments: ['Urinario', 'Ginecología'] },
  { id: '11R', number: 11, name: 'Henggu', nameChinese: 'Hueso transverso', meridianId: 'R', location: '5 cun lateral a la sínfisis púbica', indications: 'Problemas urinarios, genitales', treatments: ['Urinario', 'Ginecología'] },
  { id: '12R', number: 12, name: 'Dahe', nameChinese: 'Gran fusión', meridianId: 'R', location: '4 cun lateral a la sínfisis púbica', indications: 'Problemas urinarios, genitales, sexualidad', treatments: ['Urinario', 'Ginecología'] },
  { id: '13R', number: 13, name: 'Qixue', nameChinese: 'Cavidad de Qi', meridianId: 'R', location: '3 cun lateral a la sínfisis púbica', indications: 'Problemas urinarios, genitales, menstruales', treatments: ['Urinario', 'Ginecología'] },
  { id: '14R', number: 14, name: 'Siman', nameChinese: 'Cuatro fases', meridianId: 'R', location: '2 cun lateral a la sínfisis púbica', indications: 'Problemas urinarios, genitales, edema', treatments: ['Urinario', 'Ginecología'] },
  { id: '15R', number: 15, name: 'Zhongzhu', nameChinese: 'Isla central', meridianId: 'R', location: '1 cun lateral al ombligo', indications: 'Problemas digestivos, urinarios', treatments: ['Digestivo', 'Urinario'] },
  { id: '16R', number: 16, name: 'Huangshu', nameChinese: 'Shu de la vitalidad', meridianId: 'R', location: '0.5 cun lateral al ombligo', indications: 'Problemas digestivos, urinarios', treatments: ['Digestivo', 'Urinario'] },
  { id: '17R', number: 17, name: 'Shangqu', nameChinese: 'Curva superior', meridianId: 'R', location: '2 cun lateral a 12RM', indications: 'Problemas digestivos, abdominales', treatments: ['Digestivo'] },
  { id: '18R', number: 18, name: 'Shiguan', nameChinese: 'Puerta de la piedra', meridianId: 'R', location: '3 cun lateral a 12RM', indications: 'Problemas digestivos, urinarios', treatments: ['Digestivo', 'Urinario'] },
  { id: '19R', number: 19, name: 'Yindu', nameChinese: 'Ciudad de la plata', meridianId: 'R', location: '4 cun lateral a 12RM', indications: 'Problemas digestivos, urinarios', treatments: ['Digestivo', 'Urinario'] },
  { id: '20R', number: 20, name: 'Fu\'aigu', nameChinese: 'Abdomen del valle', meridianId: 'R', location: '5 cun lateral a 12RM', indications: 'Problemas digestivos, abdominales', treatments: ['Digestivo'] },
  { id: '21R', number: 21, name: 'Youmen', nameChinese: 'Puerta oscura', meridianId: 'R', location: '6 cun lateral a 12RM', indications: 'Problemas digestivos, vomitos', treatments: ['Digestivo'] },
  { id: '22R', number: 22, name: 'Buran', nameChinese: 'Paso interno', meridianId: 'R', location: 'En el 5º espacio intercostal, 5 cun lateral a la línea media', indications: 'Tos, problemas respiratorios', treatments: ['Respiratorio', 'Tos'] },
  { id: '23R', number: 23, name: 'Shenfeng', nameChinese: 'Sello del riñón', meridianId: 'R', location: 'En el 4º espacio intercostal, 5 cun lateral', indications: 'Tos, problemas respiratorios', treatments: ['Respiratorio', 'Tos'] },
  { id: '24R', number: 24, name: 'Daihai', nameChinese: 'Mar de la vida', meridianId: 'R', location: 'En el 3er espacio intercostal, 5 cun lateral', indications: 'Tos, dolor en el pecho', treatments: ['Tos', 'Dolor torácico'] },
  { id: '25R', number: 25, name: 'Shencang', nameChinese: 'Almacén del riñón', meridianId: 'R', location: 'En el 2º espacio intercostal, 5 cun lateral', indications: 'Tos, dolor en el pecho, asma', treatments: ['Tos', 'Asma', 'Dolor torácico'] },
  { id: '26R', number: 26, name: 'Yuzhong', nameChinese: 'Entre el pánico', meridianId: 'R', location: 'En el 1er espacio intercostal, 5 cun lateral', indications: 'Tos, dolor en el pecho, asma', treatments: ['Tos', 'Asma'] },
  { id: '27R', number: 27, name: 'Shufu', nameChinese: 'Residencia del riñón', meridianId: 'R', location: 'En el 1er espacio intercostal, 1 cun lateral a la línea media', indications: 'Tos, dolor en el pecho, enfermedades renales', treatments: ['Respiratorio', 'Riñón'] },
];

// Meridiano del Maestro Corazón / Pericardio (Shou Jue Yin) - 9 puntos
const pericardiumPoints: Point[] = [
  { id: '1MC', number: 1, name: 'Tianchi', nameChinese: 'Estanque celestial', meridianId: 'MC', location: 'En el 4º espacio intercostal, 1 cun lateral al pezón', indications: 'Problemas cardíacos, dolor en el pecho, mastitis', treatments: ['Corazón', 'Ginecología'] },
  { id: '2MC', number: 2, name: 'Quze', nameChinese: 'Curva del codo', meridianId: 'MC', location: 'En el pliegue del codo, en el lado cubital del tendón del bíceps', indications: 'Problemas cardíacos, dolor en el codo', treatments: ['Corazón', 'Dolor'] },
  { id: '3MC', number: 3, name: 'Quze', nameChinese: 'Canal curvo', meridianId: 'MC', location: 'En el centro del pliegue del codo', indications: 'Problemas cardíacos, dolor en el codo,axila', treatments: ['Corazón', 'Dolor'] },
  { id: '4MC', number: 4, name: 'Jianshi', nameChinese: 'Intermediario', meridianId: 'MC', location: '2 cun arriba del pliegue de la muñeca, entre los tendones', indications: 'Problemas cardíacos, dificultades del habla', treatments: ['Corazón'] },
  { id: '5MC', number: 5, name: 'Jianshi', nameChinese: 'Espacio entre', meridianId: 'MC', location: 'En el centro del antebrazo, 2 cun arriba del pliegue de la muñeca', indications: 'Problemas cardíacos, dificultades del habla, mareos', treatments: ['Corazón', 'Mareos'] },
  { id: '6MC', number: 6, name: 'Neiguan', nameChinese: 'Barrera interna', meridianId: 'MC', location: '2 cun arriba del pliegue de la muñeca, entre los tendones palmares', indications: 'Problemas cardíacos, digestivos, náuseas, insomnio, ansiedad', treatments: ['Corazón', 'Digestivo', 'Insomnio', 'Ansiedad'] },
  { id: '7MC', number: 7, name: 'Daling', nameChinese: 'Monte mayor', meridianId: 'MC', location: 'En el centro del pliegue de la muñeca, entre los tendones', indications: 'Problemas cardíacos, insomnio, ansiedad, digestivos', treatments: ['Corazón', 'Insomnio', 'Ansiedad', 'Digestivo'] },
  { id: '8MC', number: 8, name: 'Laogong', nameChinese: 'Palacio del trabajo', meridianId: 'MC', location: 'Centro de la palma, entre el 2º y 3er metacarpiano', indications: 'Problemas cardíacos, ansiedad, fiebre, digestivos', treatments: ['Corazón', 'Ansiedad', 'Fiebre'] },
  { id: '9MC', number: 9, name: 'Zhongchong', nameChinese: 'Asalto central', meridianId: 'MC', location: 'Ángulo ungueal central del dedo medio', indications: 'Emergencias, pérdida de conciencia, problemas cardíacos', treatments: ['Emergencia', 'Corazón'] },
];

// Meridiano del Triple Recalentador (Shou Shao Yang) - 23 puntos
const tripleHeaterPoints: Point[] = [
  { id: '1TR', number: 1, name: 'Guanchong', nameChinese: 'Asalto de la barrera', meridianId: 'TR', location: 'Ángulo ungueal cubital del dedo anular', indications: 'Fiebre, emergencias, dolor de cabeza', treatments: ['Emergencia', 'Fiebre', 'Cefalea'] },
  { id: '2TR', number: 2, name: 'Yemen', nameChinese: 'Puerta del líquido', meridianId: 'TR', location: 'Depresión distal a la 4ª articulación metacarpofalángica', indications: 'Fiebre, dolor de oído, problemas visuales', treatments: ['Fiebre', 'Oído'] },
  { id: '3TR', number: 3, name: 'Zhongzhu', nameChinese: 'Isla central', meridianId: 'TR', location: 'Depresión proximal a la 4ª articulación metacarpofalángica', indications: 'Fiebre, dolor de cabeza, rigidez de nuca', treatments: ['Fiebre', 'Cefalea'] },
  { id: '4TR', number: 4, name: 'Yangchi', nameChinese: 'Estanque Yang', meridianId: 'TR', location: 'Centro del dorso de la muñeca, en la depresión del lado radial', indications: 'Dolor de muñeca, fiebre, diabetes', treatments: ['Dolor', 'Fiebre'] },
  { id: '5TR', number: 5, name: 'Waiguan', nameChinese: 'Barrera externa', meridianId: 'TR', location: '2 cun arriba del pliegue dorsal de la muñeca, entre radio y cúbito', indications: 'Resfriado, fiebre, dolor de cabeza, estrés, problemas emocionales', treatments: ['Resfriado', 'Cefalea', 'Estrés'] },
  { id: '6TR', number: 6, name: 'Zhigou', nameChinese: 'Canal recto', meridianId: 'TR', location: '3 cun arriba del pliegue de la muñeca, en el centro del antebrazo', indications: 'Constipación, dolor en el brazo, tinnitus', treatments: ['Estreñimiento', 'Dolor', 'Tinnitus'] },
  { id: '7TR', number: 7, name: 'Huizong', nameChinese: 'Confluencia del canal', meridianId: 'TR', location: '3 cun lateral a la apófisis estiloides del cúbito', indications: 'Dolor de oído, problemas visuales', treatments: ['Oído', 'Vista'] },
  { id: '8TR', number: 8, name: 'Sanyangluo', nameChinese: 'Confluencia de los tres Yang', meridianId: 'TR', location: '4 cun arriba del pliegue de la muñeca, entre radio y cúbito', indications: 'Dolor en el brazo, problemas visuales', treatments: ['Dolor', 'Vista'] },
  { id: '9TR', number: 9, name: 'Sidu', nameChinese: 'Canal de los cuatro canales', meridianId: 'TR', location: '7 cun arriba del pliegue de la muñeca, entre radio y cúbito', indications: 'Dolor de oído, parálisis facial', treatments: ['Oído', 'Parálisis'] },
  { id: '10TR', number: 10, name: 'Tianjing', nameChinese: 'Pozo celestial', meridianId: 'TR', location: 'En la depresión 1 cun sobre el olécranon', indications: 'Dolor de codo, mareos, cefalea', treatments: ['Dolor', 'Mareos', 'Cefalea'] },
  { id: '11TR', number: 11, name: 'Qingyang', nameChinese: 'Juicio Yang', meridianId: 'TR', location: '1 cun anterior a la axila', indications: 'Dolor de hombro', treatments: ['Dolor'] },
  { id: '12TR', number: 12, name: 'Xiaoluo', nameChinese: 'Pequeño despliegue', meridianId: 'TR', location: 'En la línea axilar media, nivel del pezón', indications: 'Dolor de hombro, problemas mamarios', treatments: ['Dolor', 'Ginecología'] },
  { id: '13TR', number: 13, name: 'Naoliu', nameChinese: 'Punto del cerebro', meridianId: 'TR', location: '3 cun arriba del pezón, en el 4º espacio intercostal', indications: 'Problemas emocionales,cefalea', treatments: ['Emocional', 'Cefalea'] },
  { id: '14TR', number: 14, name: 'Jianliao', nameChinese: 'Hueso del hombro', meridianId: 'TR', location: 'Detrás del acromion', indications: 'Dolor de hombro, limitaciones de movimiento', treatments: ['Dolor'] },
  { id: '15TR', number: 15, name: 'Jianjing', nameChinese: 'Pozo del hombro', meridianId: 'TR', location: 'Punto más alto del hombro', indications: 'Dolor de hombro,cefalea, problemas mamarios', treatments: ['Dolor', 'Cefalea'] },
  { id: '16TR', number: 16, name: 'Yifeng', nameChinese: 'Viento escondido', meridianId: 'TR', location: 'En la depression detras de la oreja', indications: 'Problemas de oído, tinnitus, parálisis facial', treatments: ['Oído', 'Tinnitus', 'Parálisis'] },
  { id: '17TR', number: 17, name: 'Yifeng', nameChinese: 'Viento escondido', meridianId: 'TR', location: 'Detrás del lóbulo de la oreja, en la depresión tras el ángulo mandibular', indications: 'Problemas de oído, tinnitus, parálisis facial', treatments: ['Oído', 'Tinnitus', 'Parálisis'] },
  { id: '18TR', number: 18, name: 'Qijian', nameChinese: 'Espada de Qi', meridianId: 'TR', location: '1 cun posterior a la mastoides', indications: 'Problemas de oído, tinnitus', treatments: ['Oído', 'Tinnitus'] },
  { id: '19TR', number: 19, name: 'Jiamai', nameChinese: 'Vaso de la familia', meridianId: 'TR', location: 'Arriba de la oreja, donde late el pulso', indications: 'Cefalea, tinnitus', treatments: ['Cefalea', 'Tinnitus'] },
  { id: '20TR', number: 20, name: 'Jianhe', nameChinese: 'Unión del ángulo', meridianId: 'TR', location: 'Arriba de la oreja, en la sien', indications: 'Cefalea, tinnitus, mareos', treatments: ['Cefalea', 'Tinnitus', 'Mareos'] },
  { id: '21TR', number: 21, name: 'Jianmoyu', nameChinese: 'Hueso del hombro', meridianId: 'TR', location: 'En la fosa supraclavicular', indications: 'Dolor de hombro, problemas respiratorios', treatments: ['Dolor', 'Respiratorio'] },
  { id: '22TR', number: 22, name: 'Bingfeng', nameChinese: 'Viento del冰', meridianId: 'TR', location: 'En el centro de la ceja', indications: 'Problemas visuales, cefalea', treatments: ['Vista', 'Cefalea'] },
  { id: '23TR', number: 23, name: 'Sizhukong', nameChinese: 'Agujero del bambú', meridianId: 'TR', location: 'En el extremo lateral de la ceja', indications: 'Cefalea, problemas visuales, parálisis facial', treatments: ['Cefalea', 'Vista', 'Parálisis'] },
];

// Meridiano de la Vesícula Biliar (Zu Shao Yang) - 44 puntos
const gallbladderPoints: Point[] = [
  { id: '1VB', number: 1, name: 'Tongziliao', nameChinese: 'Hueso del lumen', meridianId: 'VB', location: 'En el ángulo externo del ojo', indications: 'Problemas visuales, dolor de cabeza', treatments: ['Vista', 'Cefalea'] },
  { id: '2VB', number: 2, name: 'Tinghui', nameChinese: 'Audición convergente', meridianId: 'VB', location: 'En la depresión del ángulo mandibular', indications: 'Problemas de oído, tinnitus, dolor dental', treatments: ['Oído', 'Tinnitus', 'Dolor dental'] },
  { id: '3VB', number: 3, name: 'Shangguan', nameChinese: 'Barrera superior', meridianId: 'VB', location: 'En el borde superior del arco cigomático', indications: 'Dolor facial, problems de ATM', treatments: ['Dolor', 'ATM'] },
  { id: '4VB', number: 4, name: 'Hanyan', nameChinese: 'Reboso de la mandíbula', meridianId: 'VB', location: '1 cun arriba de 3VB', indications: 'Cefalea, dolor mandibular', treatments: ['Cefalea', 'Dolor'] },
  { id: '5VB', number: 5, name: 'Xuanwu', nameChinese: 'Armadura suspendida', meridianId: 'VB', location: '2 cun arriba del borde superior del oído', indications: 'Cefalea, tinnitus, mareos', treatments: ['Cefalea', 'Tinnitus', 'Mareos'] },
  { id: '6VB', number: 6, name: 'Xuanli', nameChinese: 'Poder flotante', meridianId: 'VB', location: '2 cun arriba de 5VB', indications: 'Cefalea, tinnitus', treatments: ['Cefalea', 'Tinnitus'] },
  { id: '7VB', number: 7, name: 'Qubai', nameChinese: 'Cuenca frontal', meridianId: 'VB', location: 'En la depression sobre la arteria temporal', indications: 'Cefalea, mareos, problemas visuales', treatments: ['Cefalea', 'Mareos', 'Vista'] },
  { id: '8VB', number: 8, name: 'Shuaigu', nameChinese: 'Valle de la cabeza', meridianId: 'VB', location: '1 cun directamente arriba del ápice de la oreja', indications: 'Cefalea, tinnitus, mareos, vértigo', treatments: ['Cefalea', 'Tinnitus', 'Mareos'] },
  { id: '9VB', number: 9, name: 'Tianchong', nameChinese: 'Asalto celestial', meridianId: 'VB', location: '0.5 cun arriba y detrás del vertex del hueso temporal', indications: 'Cefalea, epilepsy, tinnitus', treatments: ['Cefalea', 'Tinnitus'] },
  { id: '10VB', number: 10, name: 'Fubai', nameChinese: 'Blanco flotante', meridianId: 'VB', location: '1 cun anterior a 8VB', indications: 'Cefalea, tinnitus, mareos', treatments: ['Cefalea', 'Tinnitus', 'Mareos'] },
  { id: '11VB', number: 11, name: 'Touqiaoyin', nameChinese: 'Yin de la cabeza', meridianId: 'VB', location: 'En la raíz del cabello, 1 cun anterior a la oreja', indications: 'Cefalea, tinnitus', treatments: ['Cefalea', 'Tinnitus'] },
  { id: '12VB', number: 12, name: 'Wangu', nameChinese: 'Hueso finalize', meridianId: 'VB', location: 'En la depression detras de la mastoides', indications: 'Dolor de cuello, cefalea, tinnitus', treatments: ['Dolor', 'Cefalea', 'Tinnitus'] },
  { id: '13VB', number: 13, name: ' Benshen', nameChinese: 'Raíz del espíritu', meridianId: 'VB', location: '3 cun lateral a la línea media, a nivel del nacimiento del pelo', indications: 'Problemas emocionales,cefalea', treatments: ['Emocional', 'Cefalea'] },
  { id: '14VB', number: 14, name: 'Yangbai', nameChinese: 'Yang blanco', meridianId: 'VB', location: '1 cun arriba de la ceja, en la línea vertical', indications: 'Problemas visuales, cefalea, vértigo', treatments: ['Vista', 'Cefalea', 'Mareos'] },
  { id: '15VB', number: 15, name: 'Fengchi', nameChinese: 'Estanque del viento', meridianId: 'VB', location: 'En la nuca, bajo el occipital, entre el esternocleidomastoideo y el trapecio', indications: 'Cefalea, mareos, rigidez de nuca,resfriado,hipertensión', treatments: ['Cefalea', 'Mareos', 'Resfriado', 'Hipertensión'] },
  { id: '16VB', number: 16, name: 'Fengmen', nameChinese: 'Puerta del viento', meridianId: 'VB', location: '1.5 cun detras de la oreja', indications: 'Dolor de cuello, cefalea', treatments: ['Dolor', 'Cefalea'] },
  { id: '17VB', number: 17, name: 'Yifeng', nameChinese: 'Viento escondido', meridianId: 'VB', location: 'Detras del lóbulo', indications: 'Problemas de oído, tinnitus, parálisis facial', treatments: ['Oído', 'Tinnitus', 'Parálisis'] },
  { id: '18VB', number: 18, name: 'Chengqi', nameChinese: 'Vaso de las lágrimas', meridianId: 'VB', location: '1 cun por encima de la ceja, línea vertical', indications: 'Problemas visuales, cefalea', treatments: ['Vista', 'Cefalea'] },
  { id: '19VB', number: 19, name: 'Jueyin', nameChinese: 'Confluencia Yin', meridianId: 'VB', location: '2 cun por encima de la ceja', indications: 'Rinitis, problemas nasales', treatments: ['Nariz'] },
  { id: '20VB', number: 20, name: 'Fengchi', nameChinese: 'Estanque ventoso', meridianId: 'VB', location: 'En la nuca, bajo el occipital, entre el esternocleidomastoideo y el trapecio', indications: 'Cefalea, mareos, rigidez de nuca,resfriado,hipertensión', treatments: ['Cefalea', 'Mareos', 'Resfriado'] },
  { id: '21VB', number: 21, name: 'Jianjing', nameChinese: 'Pozo del hombro', meridianId: 'VB', location: 'Punto más alto del hombro, entre Dazhui (14DM) y el acromion', indications: 'Dolor de hombro,cefalea, problemas mamarios', treatments: ['Dolor', 'Cefalea', 'Ginecología'] },
  { id: '22VB', number: 22, name: 'Yuanye', nameChinese: 'Lado del腋', meridianId: 'VB', location: 'En la línea axilar media, en el 4º espacio intercostal', indications: 'Dolor en el pecho, problemas mamarios', treatments: ['Dolor torácico', 'Ginecología'] },
  { id: '23VB', number: 23, name: 'Zhejin', nameChinese: 'Músculo lateral', meridianId: 'VB', location: '4 cun lateral a la línea media, en el 4º espacio intercostal', indications: 'Dolor en el pecho,hipocondrio', treatments: ['Dolor'] },
  { id: '24VB', number: 24, name: 'Riyue', nameChinese: 'Sol y luna', meridianId: 'VB', location: 'En el 7º espacio intercostal, прямо debajo del pezón', indications: 'Problemas hepáticos, biliares, digestivos', treatments: ['Hígado', 'Digestivo'] },
  { id: '25VB', number: 25, name: 'Jingmai', nameChinese: 'Vaso capital', meridianId: 'VB', location: 'En la línea axilar, 7º espacio intercostal', indications: 'Problemas digestivos,hepáticos', treatments: ['Digestivo', 'Hígado'] },
  { id: '26VB', number: 26, name: 'Daimai', nameChinese: 'Vaso cinturón', meridianId: 'VB', location: 'A la altura del ombligo, en la línea axilar', indications: 'Problemas genitales,urinarios, digestivos', treatments: ['Ginecología', 'Urinario', 'Digestivo'] },
  { id: '27VB', number: 27, name: 'Wushu', nameChinese: 'Cinco elementos', meridianId: 'VB', location: '5 cun lateral a la sínfisis púbica', indications: 'Problemas urinarios, genitales', treatments: ['Urinario', 'Ginecología'] },
  { id: '28VB', number: 28, name: 'Weidao', nameChinese: 'Vía de la defensa', meridianId: 'VB', location: '0.5 cun lateral y anterior a la espina iliaca anterosuperior', indications: 'Problemas urinarios, genitales, digestivos', treatments: ['Urinario', 'Ginecología', 'Digestivo'] },
  { id: '29VB', number: 29, name: 'Juliao', nameChinese: 'Hueso del pubis', meridianId: 'VB', location: 'En la depression anteroinferior del trocánter mayor', indications: 'Dolor en la cadera, problemas urinarios', treatments: ['Dolor', 'Urinario'] },
  { id: '30VB', number: 30, name: 'Huantiao', nameChinese: 'Salto de la anilla', meridianId: 'VB', location: 'Unión del tercio externo y los dos tercios internos entre el trocánter mayor y el hiato sacro', indications: 'Dolor de cadera, ciática, limitaciones de movimiento', treatments: ['Dolor', 'Ciática'] },
  { id: '31VB', number: 31, name: 'Fengshi', nameChinese: 'Mercado del viento', meridianId: 'VB', location: 'En el muslo, 7 cun arriba del pliegue poplíteo', indications: 'Dolor en el muslo, rodilla, problemas de la piel', treatments: ['Dolor', 'Piel'] },
  { id: '32VB', number: 32, name: 'Zhongdu', nameChinese: 'Ciudad central', meridianId: 'VB', location: '5 cun arriba del pliegue poplíteo', indications: 'Dolor en el muslo, problemas hepáticos', treatments: ['Dolor', 'Hígado'] },
  { id: '33VB', number: 33, name: 'Xiyangguan', nameChinese: 'Barrera de la rodilla Yang', meridianId: 'VB', location: 'En la depression lateral del pliegue de la rodilla', indications: 'Dolor de rodilla, edema', treatments: ['Dolor'] },
  { id: '34VB', number: 34, name: 'Yanglingquan', nameChinese: 'Fuente colina Yang', meridianId: 'VB', location: 'Depresión anterior e inferior a la cabeza del peroneo', indications: 'Problemas hepáticos,biliares, musculares,tendinosos,cefalea', treatments: ['Hígado', 'Dolor', 'Cefalea'] },
  { id: '35VB', number: 35, name: 'Yangjiao', nameChinese: 'Confluencia Yang', meridianId: 'VB', location: '7 cun arriba del maléolo externo', indications: 'Dolor de cabeza, edema, problemas mentales', treatments: ['Cefalea'] },
  { id: '36VB', number: 36, name: 'Waiqiu', nameChinese: 'Colina externa', meridianId: 'VB', location: '7 cun arriba del maléolo externo, en el borde anterior del peroneo', indications: 'Dolor de cabeza, edema, problemas visuales', treatments: ['Cefalea', 'Vista'] },
  { id: '37VB', number: 37, name: 'Guangming', nameChinese: 'Luz brillante', meridianId: 'VB', location: '5 cun arriba del maléolo externo', indications: 'Problemas visuales, cefalea, problemas hepáticos', treatments: ['Vista', 'Cefalea', 'Hígado'] },
  { id: '38VB', number: 38, name: 'Yangfu', nameChinese: 'Yang secundario', meridianId: 'VB', location: '4 cun arriba del maléolo externo', indications: 'Dolor de cabeza, dolor en el pie', treatments: ['Cefalea', 'Dolor'] },
  { id: '39VB', number: 39, name: 'Xuanzhong', nameChinese: 'Colina suspendida', meridianId: 'VB', location: '3 cun arriba del maléolo externo', indications: 'Dolor de cuello,cefalea,problemas mentales', treatments: ['Dolor', 'Cefalea'] },
  { id: '40VB', number: 40, name: 'Qiuxu', nameChinese: 'Colina del vacío', meridianId: 'VB', location: 'En la depression anterior al maléolo externo', indications: 'Problemas visuales, edema de tobillo', treatments: ['Vista', 'Dolor'] },
  { id: '41VB', number: 41, name: 'Zulinqi', nameChinese: 'Llorando por el pie', meridianId: 'VB', location: 'En el dorso del pie, entre 4º y 5º metatarsiano', indications: 'Cefalea, problemas hepáticos, biliares, musculares', treatments: ['Cefalea', 'Hígado', 'Dolor'] },
  { id: '42VB', number: 42, name: 'Diwuhui', nameChinese: 'Cinco reuniones de la tierra', meridianId: 'VB', location: 'Entre 4º y 5º metatarsiano', indications: 'Problemas visuales, edema', treatments: ['Vista'] },
  { id: '43VB', number: 43, name: 'Xiaxi', nameChinese: 'Arroyo estrecho', meridianId: 'VB', location: 'En el 4º espacio interdigital', indications: 'Problemas visuales, tinnitus, cefalea', treatments: ['Vista', 'Tinnitus', 'Cefalea'] },
  { id: '44VB', number: 44, name: 'Zuqiaoyin', nameChinese: 'Yin del pie', meridianId: 'VB', location: 'Ángulo ungueal del 4º dedo del pie', indications: 'Problemas visuales, cefalea, problemas hepáticos', treatments: ['Vista', 'Cefalea', 'Hígado'] },
];

// Meridiano del Hígado (Zu Jue Yin) - 14 puntos
const liverPoints: Point[] = [
  { id: '1H', number: 1, name: 'Dadun', nameChinese: 'Gran despliegue', meridianId: 'H', location: 'Ángulo ungueal del dedo gordo del pie', indications: 'Problemas genitales, urinarios, hernia, emergencia', treatments: ['Ginecología', 'Urinario', 'Emergencia'] },
  { id: '2H', number: 2, name: 'Xingjian', nameChinese: 'Espacio interlunar', meridianId: 'H', location: 'Entre el 1er y 2º dedo del pie', indications: 'Problemas hepáticos, cefalea, mareos, problemas emocionales', treatments: ['Hígado', 'Cefalea', 'Mareos', 'Emocional'] },
  { id: '3H', number: 3, name: 'Taichong', nameChinese: 'Gran asalto', meridianId: 'H', location: 'En el dorso del pie, depresión distal a la unión del 1er y 2º metatarsiano', indications: 'Problemas hepáticos, cefalea, mareos, estrés, ira, hipertensión', treatments: ['Hígado', 'Cefalea', 'Mareos', 'Estrés', 'Hipertensión'] },
  { id: '4H', number: 4, name: 'Zhongfeng', nameChinese: 'Centro del sello', meridianId: 'H', location: '1 cun anterior al maléolo interno', indications: 'Problemas urinarios, genitales, hernia', treatments: ['Urinario', 'Ginecología'] },
  { id: '5H', number: 5, name: 'Ligou', nameChinese: 'Canal del insecto', meridianId: 'H', location: '5 cun arriba del maléolo interno, en el borde interno de la tibia', indications: 'Problemas urinarios, genitales, problemas hepáticos', treatments: ['Urinario', 'Ginecología', 'Hígado'] },
  { id: '6H', number: 6, name: 'Zhongdu', nameChinese: 'Ciudad central', meridianId: 'H', location: '6 cun arriba del maléolo interno, en el borde interno de la tibia', indications: 'Problemas hepáticos, genitales, edema', treatments: ['Hígado', 'Ginecología'] },
  { id: '7H', number: 7, name: 'Xiguan', nameChinese: 'Articulación de la rodilla', meridianId: 'H', location: 'Posterior al epicóndilo medial del fémur', indications: 'Dolor de rodilla, problemas hepáticos', treatments: ['Dolor', 'Hígado'] },
  { id: '8H', number: 8, name: 'Ququan', nameChinese: 'Fuente curva', meridianId: 'H', location: 'En la depression proximal al epicóndilo medial del fémur', indications: 'Problemas urinarios, genitales, hepáticos, hernia', treatments: ['Urinario', 'Ginecología', 'Hígado'] },
  { id: '9H', number: 9, name: 'Yinbao', nameChinese: 'Bolsa Yin', meridianId: 'H', location: '4 cun arriba del epicóndilo medial del fémur', indications: 'Problemas urinarios, genitales, irregularidades menstruales', treatments: ['Urinario', 'Ginecología'] },
  { id: '10H', number: 10, name: 'Zuwu', nameChinese: 'Cinco distancias', meridianId: 'H', location: '2 cun lateral al polo superior de la rótula', indications: 'Problemas hepáticos, problemas genitales, edema', treatments: ['Hígado', 'Ginecología'] },
  { id: '11H', number: 11, name: 'Yinlian', nameChinese: 'Unión Yin', meridianId: 'H', location: '2 cun distal a 10H', indications: 'Problemas genitales, irregularidades menstruales', treatments: ['Ginecología'] },
  { id: '12H', number: 12, name: 'Jiemai', nameChinese: 'Vía de la confusión', meridianId: 'H', location: '1 cun distal a 11H', indications: 'Problemas digestivos, hepáticos', treatments: ['Digestivo', 'Hígado'] },
  { id: '13H', number: 13, name: 'Zhangmen', nameChinese: 'Puerta del refugio', meridianId: 'H', location: 'Extremo libre de la 11ª costilla', indications: 'Problemas hepáticos, digestivos, edema, problemas emocionales', treatments: ['Hígado', 'Digestivo', 'Emocional'] },
  { id: '14H', number: 14, name: 'Qimen', nameChinese: 'Puerta del cielo', meridianId: 'H', location: '6º espacio intercostal, en la línea mamilar', indications: 'Problemas hepáticos, emocionales, dolor en el pecho, irregularidades menstruales', treatments: ['Hígado', 'Emocional', 'Dolor torácico', 'Ginecología'] },
];

// Puntos de los Vasos Extraordinarios
const extraVesselPoints: Point[] = [
  // Vaso Gobernador (Du Mai) - 20 puntos
  { id: '1DM', number: 1, name: 'Changqiang', nameChinese: 'Fortaleza larga', meridianId: 'DM', location: 'Entre el cóccix y el ano', indications: 'Emergencias, problemas rectales, hemorroides, epilepsia', treatments: ['Emergencia', 'Hemorroides'] },
  { id: '2DM', number: 2, name: 'Yaoyangquan', nameChinese: 'Vértebra Yang lumbar', meridianId: 'DM', location: 'En la depresión debajo de la apófisis espinosa de L4', indications: 'Problemas lumbares, urinarios, genitales', treatments: ['Lumbalgia', 'Urinario'] },
  { id: '3DM', number: 3, name: 'Yaoyangquan', nameChinese: 'Puerta de la energía Yang', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de L3', indications: 'Lumbalgia, problemas urinarios, sexuales', treatments: ['Lumbalgia', 'Urinario'] },
  { id: '4DM', number: 4, name: 'Mingmen', nameChinese: 'Puerta de la vida', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de L2', indications: 'Tonificación renal, problemas lumbares, fatiga, vitalidad', treatments: ['Tonificación', 'Lumbalgia', 'Fortalecimiento'] },
  { id: '5DM', number: 5, name: 'Xuanshu', nameChinese: 'Vértebra flotante', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de L1', indications: 'Dolor abdominal, problemas digestivos', treatments: ['Digestivo', 'Dolor'] },
  { id: '6DM', number: 6, name: 'Jizhong', nameChinese: 'Centro de la脊柱', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T11', indications: 'Problemas digestivos, epilepsia', treatments: ['Digestivo'] },
  { id: '7DM', number: 7, name: 'Zhongshu', nameChinese: 'Vértebra central', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T10', indications: 'Problemas digestivos, tos', treatments: ['Digestivo', 'Tos'] },
  { id: '8DM', number: 8, name: 'Jiuwei', nameChinese: 'Cola de gorrión', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T9', indications: 'Problemas mentales, digestivos, epilepsia', treatments: ['Emocional', 'Digestivo'] },
  { id: '9DM', number: 9, name: 'Zhiyang', nameChinese: 'Comunicación Yang', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T7', indications: 'Problemas hepáticos, digestivos, respiratorias', treatments: ['Hígado', 'Digestivo', 'Respiratorio'] },
  { id: '10DM', number: 10, name: 'Lingtai', nameChinese: 'Plataforma del espíritu', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T6', indications: 'Tos, fiebre, problemas mentales', treatments: ['Tos', 'Fiebre', 'Emocional'] },
  { id: '11DM', number: 11, name: 'Shenzhu', nameChinese: 'Soporte del cuerpo', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T5', indications: 'Problemas pulmonares, tos, fiebre', treatments: ['Respiratorio', 'Tos', 'Fiebre'] },
  { id: '12DM', number: 12, name: 'Shenzhong', nameChinese: 'Centro divino', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T5', indications: 'Problemas cardíacos, pulmonares, emocionales', treatments: ['Corazón', 'Respiratorio', 'Emocional'] },
  { id: '13DM', number: 13, name: 'Taodao', nameChinese: 'Camino del cacao', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de T3', indications: 'Fiebre, resfriado, problemas pulmonares', treatments: ['Resfriado', 'Fiebre', 'Respiratorio'] },
  { id: '14DM', number: 14, name: 'Dazhui', nameChinese: 'Gran vértebra', meridianId: 'DM', location: 'Debajo de la apófisis espinosa de C7', indications: 'Fiebre, resfriado, problemas pulmonares, cefalea, estrés', treatments: ['Resfriado', 'Fiebre', 'Respiratorio', 'Cefalea', 'Estrés'] },
  { id: '15DM', number: 15, name: 'Yamen', nameChinese: 'Puerta del muda', meridianId: 'DM', location: '0.5 cun debajo de 14DM', indications: 'Problemas del habla, parálisis, cefalea', treatments: ['Parálisis', 'Cefalea'] },
  { id: '16DM', number: 16, name: 'Fengfu', nameChinese: 'Residencia del viento', meridianId: 'DM', location: '1 cun encima de la línea del cabello, en la nuca', indications: 'Problemas cerebrales, cefalea, rigidez de nuca', treatments: ['Neurológico', 'Cefalea', 'Dolor'] },
  { id: '17DM', number: 17, name: 'Naohu', nameChinese: 'Puerta del cerebro', meridianId: 'DM', location: '1.5 cun encima de la línea del cabello', indications: 'Problemas cerebrales, cefalea, mareos', treatments: ['Neurológico', 'Cefalea', 'Mareos'] },
  { id: '18DM', number: 18, name: 'Qiangjian', nameChinese: 'Espada fuerte', meridianId: 'DM', location: '2 cun encima de la línea del cabello', indications: 'Problemas cerebrales, cefalea, epilepsia', treatments: ['Neurológico', 'Cefalea'] },
  { id: '19DM', number: 19, name: 'Houding', nameChinese: 'Detrás delvertex', meridianId: 'DM', location: '3 cun encima de la línea del cabello', indications: 'Cefalea, problemas mentales', treatments: ['Cefalea', 'Emocional'] },
  { id: '20DM', number: 20, name: 'Baihui', nameChinese: 'Cien reuniones', meridianId: 'DM', location: 'En el vértex de la cabeza, línea media', indications: 'Problemas cerebrales, mentales, cefalea, mareos,insomnio, emergencia', treatments: ['Neurológico', 'Emocional', 'Cefalea', 'Insomnio', 'Emergencia'] },

  // Vaso Concepción (Ren Mai) - 24 puntos
  { id: '1RM', number: 1, name: 'Huiyin', nameChinese: 'Confluencia del Yin', meridianId: 'RM', location: 'Entre el ano y los genitales', indications: 'Problemas genitales, urinarios, emergencia', treatments: ['Ginecología', 'Urinario', 'Emergencia'] },
  { id: '2RM', number: 2, name: 'Qugu', nameChinese: 'Hueso curvado', meridianId: 'RM', location: 'En el borde superior del pubis', indications: 'Problemas urinarios, genitales, hernia', treatments: ['Urinario', 'Ginecología'] },
  { id: '3RM', number: 3, name: 'Zhongji', nameChinese: 'Polo medio', meridianId: 'RM', location: '4 cun debajo del ombligo, línea media', indications: 'Problemas urinarios, genitales, menstruales', treatments: ['Urinario', 'Ginecología'] },
  { id: '4RM', number: 4, name: 'Guanyuan', nameChinese: 'Barrera de la fuente', meridianId: 'RM', location: '3 cun debajo del ombligo, línea media', indications: 'Tonificación, problemas urinarios, genitales, fatiga', treatments: ['Tonificación', 'Urinario', 'Ginecología', 'Fortalecimiento'] },
  { id: '5RM', number: 5, name: 'Shimen', nameChinese: 'Puerta de piedra', meridianId: 'RM', location: '2 cun debajo del ombligo', indications: 'Problemas urinarios, genitales, edema', treatments: ['Urinario', 'Ginecología'] },
  { id: '6RM', number: 6, name: 'Qihai', nameChinese: 'Mar de la energía', meridianId: 'RM', location: '1.5 cun debajo del ombligo, línea media', indications: 'Tonificación general, fatiga, problemas digestivos', treatments: ['Tonificación', 'Digestivo', 'Fortalecimiento'] },
  { id: '7RM', number: 7, name: 'Yinjiao', nameChinese: 'Unión del Yin', meridianId: 'RM', location: '1 cun debajo del ombligo', indications: 'Problemas digestivos, urinarios, genitales', treatments: ['Digestivo', 'Urinario', 'Ginecología'] },
  { id: '8RM', number: 8, name: 'Shenque', nameChinese: 'Canal divino', meridianId: 'RM', location: 'Centro del ombligo', indications: 'Problemas digestivos, urinarios, emergencia, tonificación', treatments: ['Digestivo', 'Tonificación', 'Emergencia'] },
  { id: '9RM', number: 9, name: 'Shuifen', nameChinese: 'División del agua', meridianId: 'RM', location: '1 cun encima del ombligo', indications: 'Problemas digestivos, retención de líquidos', treatments: ['Digestivo'] },
  { id: '10RM', number: 10, name: 'Xianjiang', nameChinese: 'Vena del agua', meridianId: 'RM', location: '2 cun encima del ombligo, línea media', indications: 'Problemas digestivos, diabetes', treatments: ['Digestivo'] },
  { id: '11RM', number: 11, name: 'Jianli', nameChinese: 'Estómago inferior', meridianId: 'RM', location: '3 cun encima del ombligo', indications: 'Problemas digestivos, gastritis', treatments: ['Digestivo', 'Gastralgia'] },
  { id: '12RM', number: 12, name: 'Zhongwan', nameChinese: 'Centro del estómago', meridianId: 'RM', location: '4 cun sobre el ombligo, línea media anterior', indications: 'Problemas gástricos, digestivos, náuseas', treatments: ['Gastralgia', 'Digestivo'] },
  { id: '13RM', number: 13, name: 'Shangwan', nameChinese: 'Estómago superior', meridianId: 'RM', location: '5 cun encima del ombligo', indications: 'Problemas gástricos, digestivos, reflujo', treatments: ['Gastralgia', 'Digestivo'] },
  { id: '14RM', number: 14, name: 'Juque', nameChinese: 'Gran mansión', meridianId: 'RM', location: '6 cun encima del ombligo', indications: 'Problemas cardíacos, emocionales, digestivos', treatments: ['Corazón', 'Emocional', 'Digestivo'] },
  { id: '15RM', number: 15, name: 'Jiuwei', nameChinese: 'Cola de gorrión', meridianId: 'RM', location: 'Debajo del apéndice xifoides', indications: 'Problemas emocionales, digestivos, epilepsia', treatments: ['Emocional', 'Digestivo'] },
  { id: '16RM', number: 16, name: 'Yingtang', nameChinese: 'Sala del pecho', meridianId: 'RM', location: 'A nivel del 5º espacio intercostal', indications: 'Problemas cardíacos, pulmonares, emocionales', treatments: ['Corazón', 'Respiratorio', 'Emocional'] },
  { id: '17RM', number: 17, name: 'Shanzhong', nameChinese: 'Centro del tórax', meridianId: 'RM', location: 'Entre los pezones, sobre el esternón', indications: 'Problemas cardíacos, pulmonares, emocionales, lactancia', treatments: ['Corazón', 'Respiratorio', 'Emocional', 'Ginecología'] },
  { id: '18RM', number: 18, name: 'Yutang', nameChinese: 'Sala del jade', meridianId: 'RM', location: 'En el 3er espacio intercostal', indications: 'Tos, problemas pulmonares, pecho', treatments: ['Respiratorio', 'Tos'] },
  { id: '19RM', number: 19, name: 'Zigong', nameChinese: 'Palacio del niño', meridianId: 'RM', location: 'En el 2º espacio intercostal', indications: 'Tos, problemas pulmonares, gynecologia', treatments: ['Respiratorio', 'Tos', 'Ginecología'] },
  { id: '20RM', number: 20, name: 'Huagai', nameChinese: 'Carruaje decorado', meridianId: 'RM', location: 'En el 1er espacio intercostal', indications: 'Tos, dolor en el pecho, problemas pulmonares', treatments: ['Respiratorio', 'Tos', 'Dolor torácico'] },
  { id: '21RM', number: 21, name: 'Xuanji', nameChinese: 'Joya suspendida', meridianId: 'RM', location: 'Encima del esternón, nivel de la clavícula', indications: 'Tos, dolor en el pecho, problemas pulmonares', treatments: ['Respiratorio', 'Tos', 'Dolor torácico'] },
  { id: '22RM', number: 22, name: 'Tiantu', nameChinese: 'Entrada celestial', meridianId: 'RM', location: 'En el centro de la fosa yugular, 0.5 cun encima del borde superior del esternón', indications: 'Tos, asma, dolor de garganta, problemas pulmonares', treatments: ['Tos', 'Asma', 'Dolor de garganta', 'Respiratorio'] },
  { id: '23RM', number: 23, name: 'Lianquan', nameChinese: 'Fuente refinada', meridianId: 'RM', location: 'En la depression arriba del hueso hioides', indications: 'Dificultades del habla, dolor de garganta, problemas de lengua', treatments: ['Dolor de garganta', 'Lengua'] },
  { id: '24RM', number: 24, name: 'Chengjiang', nameChinese: 'Recipiente de la energía', meridianId: 'RM', location: 'En el surco mentolabial', indications: 'Problemas faciales, digestivos, emergencia', treatments: ['Cara', 'Digestivo', 'Emergencia'] },
];

// Combinar TODOS los puntos
export const allPointsComplete: Point[] = [
  ...lungPoints,
  ...largeIntestinePoints,
  ...stomachPoints,
  ...spleenPoints,
  ...heartPoints,
  ...smallIntestinePoints,
  ...bladderPoints,
  ...kidneyPoints,
  ...pericardiumPoints,
  ...tripleHeaterPoints,
  ...gallbladderPoints,
  ...liverPoints,
  ...extraVesselPoints,
];
