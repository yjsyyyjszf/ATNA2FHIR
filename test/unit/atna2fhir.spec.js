const fs = require('fs')
let converter

describe('Converts ATNA AuditMessages to FHIR AuditEvents', () => {
  const dateRightNowIsoString = '2020-01-01T12:00:00.500-08:00'
  const mockUUID = '1234-1234-1234-1234'

  beforeEach(() => {
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => {
        return {
          toISOString: () => dateRightNowIsoString
        }
      })

    jest.mock('uuid', () => ({
      v4: () => mockUUID
    }))

    converter = require('../../lib')
  })

  describe('A "basic" ATNA AuditMessage', () => {
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/basic-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/basic-atna.xml')

    it('sets .recorded to the result of new Date().toISOString()', async () => {
      const auditEvent = await converter.convert(atna)
      expect(auditEvent.recorded).toEqual(dateRightNowIsoString)
    })

    it('maps the the basic ATNA AuditMessage to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })

  describe('An ATNA representation of a FHIR example-search', () => {
    // source: https://www.hl7.org/fhir/audit-event-example-search.json.html
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/example-search-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/example-search-atna.xml')

    it('maps an ATNA representation of a FHIR example-search to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })

  describe('An IHE - ITI-48 Retrieve Value Set Consumer ATNA AuditMessage', () => {
    // source: https://ehealthsuisse.ihe-europe.net/EVSClient//detailedResult.seam?type=ATNA&oid=1.3.6.1.4.1.12559.11.25.1.13.46476
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/ITI-48-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/ITI-48-atna.xml')

    it('maps the IHE - ITI-48 Retrieve Value Set Consumer ATNA AuditMessage to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })

  describe('An IHE - ITI-8 Patient Identifier Cross-reference Manager or Document Registry Actor audit message (Create or Update)', () => {
    // source: https://ehealthsuisse.ihe-europe.net/EVSClient//detailedResult.seam?type=ATNA&oid=1.3.6.1.4.1.12559.11.25.1.13.43704
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/ITI-8-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/ITI-8-atna.xml')

    it('maps the IHE - ITI-8 Patient Identifier Cross-reference Manager or Document Registry Actor audit message (Create or Update) to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })

  describe('An IHE - ITI-43 Document Consumer audit message [DICOM extension compatible]', () => {
    // source: https://ehealthsuisse.ihe-europe.net/EVSClient//detailedResult.seam?type=ATNA&oid=1.3.6.1.4.1.12559.11.25.1.13.18994
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/ITI-43-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/ITI-43-atna.xml')

    it('maps the IHE - ITI-43 Document Consumer audit message [DICOM extension compatible] to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })

  describe('.wrapInABundleTransaction', () => {
    it('wraps in a FHIR Bundle', async () => {
      const fhir = JSON.parse(fs.readFileSync('test/unit/data/basic-fhir-bundle.json'))
      const atna = fs.readFileSync('test/unit/data/basic-atna.xml')
      const converted = await converter.convert(atna)
      converted.recorded = dateRightNowIsoString
      const wrapped = converter.wrapInABundleTransaction(converted)
      expect(wrapped).toEqual(fhir)
    })
  })
})
