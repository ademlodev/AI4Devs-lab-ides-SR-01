const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010';

async function testAPI() {
  console.log('🧪 Probando API del Sistema ATS...\n');

  try {
    // 1. Probar endpoint principal
    console.log('1. Probando endpoint principal...');
    const mainResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Endpoint principal:', mainResponse.data.message);
    console.log('📋 Endpoints disponibles:', mainResponse.data.endpoints);

    // 2. Probar obtener candidatos (debe estar vacío inicialmente)
    console.log('\n2. Probando obtener candidatos...');
    const applicantsResponse = await axios.get(
      `${API_BASE_URL}/api/applicants`,
    );
    console.log(
      '✅ Candidatos obtenidos:',
      applicantsResponse.data.count,
      'candidatos',
    );

    // 3. Probar crear un candidato
    console.log('\n3. Probando crear candidato...');
    const newApplicant = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@test.com',
      phone: '+34612345678',
      address: 'Calle Test 123, Madrid',
      education: [
        {
          institution: 'Universidad Test',
          degree: 'Ingeniero Informático',
          field: 'Informática',
          startDate: '2018-09-01',
          endDate: '2022-06-30',
          description: 'Grado en Ingeniería Informática',
        },
      ],
      workExperience: [
        {
          company: 'TechCorp Test',
          position: 'Desarrollador Full Stack',
          startDate: '2022-07-01',
          endDate: '2024-01-31',
          description: 'Desarrollo de aplicaciones web',
          responsibilities: ['Desarrollo frontend', 'Desarrollo backend'],
        },
      ],
      recruiterId: 1,
    };

    const createResponse = await axios.post(
      `${API_BASE_URL}/api/applicants`,
      newApplicant,
    );
    console.log('✅ Candidato creado:', createResponse.data.message);
    console.log('🆔 ID del candidato:', createResponse.data.data.id);

    // 4. Probar obtener el candidato creado
    console.log('\n4. Probando obtener candidato por ID...');
    const applicantId = createResponse.data.data.id;
    const getApplicantResponse = await axios.get(
      `${API_BASE_URL}/api/applicants/${applicantId}`,
    );
    console.log(
      '✅ Candidato obtenido:',
      getApplicantResponse.data.data.firstName,
      getApplicantResponse.data.data.lastName,
    );

    // 5. Probar validaciones
    console.log('\n5. Probando validaciones...');
    try {
      const invalidApplicant = {
        firstName: '', // Campo vacío
        lastName: 'Pérez',
        email: 'email-invalido', // Email inválido
        phone: '123', // Teléfono inválido
        education: [],
        workExperience: [],
        recruiterId: 1,
      };

      await axios.post(`${API_BASE_URL}/api/applicants`, invalidApplicant);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(
          '✅ Validaciones funcionando:',
          error.response.data.message,
        );
        console.log(
          '📝 Errores de validación:',
          error.response.data.errors.length,
          'errores encontrados',
        );
      }
    }

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('🚀 El backend está funcionando correctamente.');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Data:', error.response.data);
    }
  }
}

// Ejecutar pruebas
testAPI();
