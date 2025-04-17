namespace server.DTO
{
    public class MedicalRecordDTO
    {
        public class PrescriptionRequest
        {
            public string Diagnosis { get; set; }
            public string Treatment { get; set; }
            public string Notes { get; set; }
            public List<MedicineDto> Medicines { get; set; }
        }

        public class MedicineDto
        {
            public int MedicineId { get; set; }
            public string MedicineName { get; set; }
            public string Dosage { get; set; }
            public string FrequencyPerDay { get; set; }
            public string DurationInDays { get; set; }
            public string Usage { get; set; }
            public string Unit { get; set; }
            public int Quantity { get; set; }

        }
    }
}
