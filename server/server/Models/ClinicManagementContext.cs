using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class ClinicManagementContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
{
    public ClinicManagementContext()
    {
    }

    public ClinicManagementContext(DbContextOptions<ClinicManagementContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    //public virtual DbSet<AspNetRole> AspNetRoles { get; set; }

    //public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

    //public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

    //public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

    //public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<MedicalRecord> MedicalRecords { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Prescription> Prescriptions { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceRegistration> ServiceRegistrations { get; set; }

    public virtual DbSet<Specialty> Specialties { get; set; }

    public virtual DbSet<User> Users { get; set; }

    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    modelBuilder.Entity<Appointment>(entity =>
    //    {
    //        entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA2D8B95A6A");

    //        entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
    //        entity.Property(e => e.AppointmentDate).HasColumnType("datetime");
    //        entity.Property(e => e.DoctorId).HasColumnName("DoctorID");
    //        entity.Property(e => e.PatientId).HasColumnName("PatientID");
    //        entity.Property(e => e.Status).HasMaxLength(50);

    //        entity.HasOne(d => d.Doctor).WithMany(p => p.Appointments)
    //            .HasForeignKey(d => d.DoctorId)
    //            .HasConstraintName("FK__Appointme__Docto__4E53A1AA");

    //        entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
    //            .HasForeignKey(d => d.PatientId)
    //            .HasConstraintName("FK__Appointme__Patie__4D5F7D71");
    //    });

    //    modelBuilder.Entity<AspNetRole>(entity =>
    //    {
    //        entity.Property(e => e.Name).HasMaxLength(256);
    //        entity.Property(e => e.NormalizedName).HasMaxLength(256);
    //    });

    //    modelBuilder.Entity<AspNetUser>(entity =>
    //    {
    //        entity.HasKey(e => e.Id).HasName("PK__AspNetUs__3214EC078E309BBC");

    //        entity.Property(e => e.Email).HasMaxLength(256);
    //        entity.Property(e => e.LockoutEnabled).HasDefaultValue(true);
    //        entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
    //        entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
    //        entity.Property(e => e.UserName).HasMaxLength(256);

    //        entity.HasMany(d => d.Roles).WithMany(p => p.Users)
    //            .UsingEntity<Dictionary<string, object>>(
    //                "AspNetUserRole",
    //                r => r.HasOne<AspNetRole>().WithMany()
    //                    .HasForeignKey("RoleId")
    //                    .OnDelete(DeleteBehavior.ClientSetNull)
    //                    .HasConstraintName("FK_AspNetUserRoles_Roles"),
    //                l => l.HasOne<AspNetUser>().WithMany()
    //                    .HasForeignKey("UserId")
    //                    .OnDelete(DeleteBehavior.ClientSetNull)
    //                    .HasConstraintName("FK_AspNetUserRoles_Users"),
    //                j =>
    //                {
    //                    j.HasKey("UserId", "RoleId").HasName("PK__AspNetUs__AF2760AD9458BD5D");
    //                    j.ToTable("AspNetUserRoles");
    //                });
    //    });

    //    modelBuilder.Entity<AspNetUserClaim>(entity =>
    //    {
    //        entity.HasKey(e => e.Id).HasName("PK__AspNetUs__3214EC07677B5BC0");

    //        entity.HasOne(d => d.User).WithMany(p => p.AspNetUserClaims)
    //            .HasForeignKey(d => d.UserId)
    //            .HasConstraintName("FK__AspNetUse__UserI__558AAF1E");
    //    });

    //    modelBuilder.Entity<AspNetUserLogin>(entity =>
    //    {
    //        entity.HasKey(e => new { e.LoginProvider, e.ProviderKey }).HasName("PK__AspNetUs__2B2C5B52EFF08A85");

    //        entity.Property(e => e.Id)
    //            .ValueGeneratedOnAdd()
    //            .HasColumnName("ID");

    //        entity.HasOne(d => d.User).WithMany(p => p.AspNetUserLogins)
    //            .HasForeignKey(d => d.UserId)
    //            .HasConstraintName("FK__AspNetUse__UserI__567ED357");
    //    });

    //    modelBuilder.Entity<AspNetUserToken>(entity =>
    //    {
    //        entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name }).HasName("PK__AspNetUs__8CC49841968C5E5D");

    //        entity.Property(e => e.UserId).ValueGeneratedOnAdd();
    //    });

    //    modelBuilder.Entity<Doctor>(entity =>
    //    {
    //        entity.HasKey(e => e.DoctorId).HasName("PK__Doctors__2DC00EDF3E6EE7C7");

    //        entity.HasIndex(e => e.UserId, "UQ__Doctors__1788CCADE5A60ECA").IsUnique();

    //        entity.Property(e => e.DoctorId).HasColumnName("DoctorID");
    //        entity.Property(e => e.SpecialtyId).HasColumnName("SpecialtyID");
    //        entity.Property(e => e.UserId).HasColumnName("UserID");

    //        entity.HasOne(d => d.Specialty).WithMany(p => p.Doctors)
    //            .HasForeignKey(d => d.SpecialtyId)
    //            .HasConstraintName("FK__Doctors__Special__45BE5BA9");

    //        entity.HasOne(d => d.User).WithOne(p => p.Doctor)
    //            .HasForeignKey<Doctor>(d => d.UserId)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Doctors_AspNetUsers");
    //    });

    //    modelBuilder.Entity<MedicalRecord>(entity =>
    //    {
    //        entity.HasKey(e => e.RecordId).HasName("PK__MedicalR__FBDF78C9840459D5");

    //        entity.HasIndex(e => e.AppointmentId, "UQ__MedicalR__8ECDFCA3BB61DEC3").IsUnique();

    //        entity.Property(e => e.RecordId).HasColumnName("RecordID");
    //        entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
    //        entity.Property(e => e.Diagnosis).HasMaxLength(255);
    //        entity.Property(e => e.Treatment).HasMaxLength(255);

    //        entity.HasOne(d => d.Appointment).WithOne(p => p.MedicalRecord)
    //            .HasForeignKey<MedicalRecord>(d => d.AppointmentId)
    //            .HasConstraintName("FK__MedicalRe__Appoi__5224328E");
    //    });

    //    modelBuilder.Entity<Patient>(entity =>
    //    {
    //        entity.HasKey(e => e.PatientId).HasName("PK__Patients__970EC34619C63D9E");

    //        entity.HasIndex(e => e.UserId, "UQ__Patients__1788CCAD13D1B002").IsUnique();

    //        entity.Property(e => e.PatientId).HasColumnName("PatientID");
    //        entity.Property(e => e.Address).HasMaxLength(255);
    //        entity.Property(e => e.UserId).HasColumnName("UserID");

    //        entity.HasOne(d => d.User).WithOne(p => p.Patient)
    //            .HasForeignKey<Patient>(d => d.UserId)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Patients_AspNetUsers");
    //    });

    //    modelBuilder.Entity<Payment>(entity =>
    //    {
    //        entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A58E41BFC65");

    //        entity.HasIndex(e => e.AppointmentId, "UQ__Payments__8ECDFCA3EE667EE2").IsUnique();

    //        entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
    //        entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
    //        entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
    //        entity.Property(e => e.PaymentDate)
    //            .HasDefaultValueSql("(getdate())")
    //            .HasColumnType("datetime");
    //        entity.Property(e => e.Status).HasMaxLength(50);

    //        entity.HasOne(d => d.Appointment).WithOne(p => p.Payment)
    //            .HasForeignKey<Payment>(d => d.AppointmentId)
    //            .HasConstraintName("FK__Payments__Appoin__5AB9788F");
    //    });

    //    modelBuilder.Entity<Prescription>(entity =>
    //    {
    //        entity.HasKey(e => e.PrescriptionId).HasName("PK__Prescrip__40130812D4F20419");

    //        entity.Property(e => e.PrescriptionId).HasColumnName("PrescriptionID");
    //        entity.Property(e => e.Dosage).HasMaxLength(255);
    //        entity.Property(e => e.Medicine).HasMaxLength(255);
    //        entity.Property(e => e.RecordId).HasColumnName("RecordID");

    //        entity.HasOne(d => d.Record).WithMany(p => p.Prescriptions)
    //            .HasForeignKey(d => d.RecordId)
    //            .HasConstraintName("FK__Prescript__Recor__55009F39");
    //    });

    //    modelBuilder.Entity<Service>(entity =>
    //    {
    //        entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB0EA66A5E681");

    //        entity.HasIndex(e => e.ServiceName, "UQ__Services__A42B5F9946E0F3F3").IsUnique();

    //        entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
    //        entity.Property(e => e.CreatedAt)
    //            .HasDefaultValueSql("(getdate())")
    //            .HasColumnType("datetime");
    //        entity.Property(e => e.Description).HasMaxLength(500);
    //        entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
    //        entity.Property(e => e.ServiceName).HasMaxLength(255);
    //    });

    //    modelBuilder.Entity<ServiceRegistration>(entity =>
    //    {
    //        entity.HasKey(e => e.RegistrationId).HasName("PK__ServiceR__6EF58830115C6A91");

    //        entity.Property(e => e.RegistrationId).HasColumnName("RegistrationID");
    //        entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
    //        entity.Property(e => e.PatientId).HasColumnName("PatientID");
    //        entity.Property(e => e.RegistrationDate)
    //            .HasDefaultValueSql("(getdate())")
    //            .HasColumnType("datetime");
    //        entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
    //        entity.Property(e => e.Status).HasMaxLength(50);

    //        entity.HasOne(d => d.Appointment).WithMany(p => p.ServiceRegistrations)
    //            .HasForeignKey(d => d.AppointmentId)
    //            .HasConstraintName("FK__ServiceRe__Appoi__65370702");

    //        entity.HasOne(d => d.Patient).WithMany(p => p.ServiceRegistrations)
    //            .HasForeignKey(d => d.PatientId)
    //            .HasConstraintName("FK__ServiceRe__Patie__634EBE90");

    //        entity.HasOne(d => d.Service).WithMany(p => p.ServiceRegistrations)
    //            .HasForeignKey(d => d.ServiceId)
    //            .HasConstraintName("FK__ServiceRe__Servi__6442E2C9");
    //    });

    //    modelBuilder.Entity<Specialty>(entity =>
    //    {
    //        entity.HasKey(e => e.SpecialtyId).HasName("PK__Specialt__D768F648A8F2AA6D");

    //        entity.HasIndex(e => e.Name, "UQ__Specialt__737584F6A3F2D7BE").IsUnique();

    //        entity.Property(e => e.SpecialtyId).HasColumnName("SpecialtyID");
    //        entity.Property(e => e.Description).HasMaxLength(500);
    //        entity.Property(e => e.Name).HasMaxLength(100);

    //        entity.HasMany(d => d.Services).WithMany(p => p.Specialties)
    //            .UsingEntity<Dictionary<string, object>>(
    //                "SpecialtyService",
    //                r => r.HasOne<Service>().WithMany()
    //                    .HasForeignKey("ServiceId")
    //                    .OnDelete(DeleteBehavior.ClientSetNull)
    //                    .HasConstraintName("FK__Specialty__Servi__09746778"),
    //                l => l.HasOne<Specialty>().WithMany()
    //                    .HasForeignKey("SpecialtyId")
    //                    .OnDelete(DeleteBehavior.ClientSetNull)
    //                    .HasConstraintName("FK__Specialty__Speci__0880433F"),
    //                j =>
    //                {
    //                    j.HasKey("SpecialtyId", "ServiceId").HasName("PK__Specialt__6B394DA853777237");
    //                    j.ToTable("SpecialtyService");
    //                });
    //    });

    //    modelBuilder.Entity<User>(entity =>
    //    {
    //        entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACA34D314B");

    //        entity.HasIndex(e => e.Email, "UQ__Users__A9D10534404F7C68").IsUnique();

    //        entity.Property(e => e.UserId).HasColumnName("UserID");
    //        entity.Property(e => e.CreatedAt)
    //            .HasDefaultValueSql("(getdate())")
    //            .HasColumnType("datetime");
    //        entity.Property(e => e.Email).HasMaxLength(100);
    //        entity.Property(e => e.FullName).HasMaxLength(100);
    //        entity.Property(e => e.PasswordHash).HasMaxLength(255);
    //        entity.Property(e => e.PhoneNumber).HasMaxLength(20);
    //        entity.Property(e => e.Role).HasMaxLength(50);
    //    });

    //    OnModelCreatingPartial(modelBuilder);
    //}

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
