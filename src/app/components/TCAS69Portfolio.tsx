"use client";
import React, { useState, useCallback, useMemo } from 'react';
import { Camera, Upload, GraduationCap, User, Award, FileText, ChevronDown, ChevronUp, Eye, Phone, MapPin, School } from 'lucide-react';

const TCAS69Portfolio = () => {
  const [currentView, setCurrentView] = useState('form');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    school: '',
    gpa: '',
    specialSkills: '',
    applicationReason: '',
    email: '',
    birthDate: '',
    parentPhone: '',
    profileImage: null,
    activityImages: [],
    awardImages: [],
    portfolioImages: []
  });
  const [errors, setErrors] = useState({});

  // Validation rules - ใช้ useCallback เพื่อป้องกัน re-render
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName.trim()) newErrors.lastName = 'กรุณากรอกนามสกุล';
    if (!formData.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่';
    if (!formData.phone.trim()) newErrors.phone = 'กรุณากรอกหมายเลขโทรศัพท์';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
    if (!formData.school.trim()) newErrors.school = 'กรุณากรอกชื่อโรงเรียน';
    if (!formData.gpa) newErrors.gpa = 'กรุณากรอกเกรดเฉลี่ย';
    else if (formData.gpa < 0 || formData.gpa > 4) newErrors.gpa = 'เกรดเฉลี่ยต้องอยู่ระหว่าง 0-4';
    if (!formData.specialSkills.trim()) newErrors.specialSkills = 'กรุณากรอกความสามารถพิเศษ';
    if (!formData.applicationReason.trim()) newErrors.applicationReason = 'กรุณากรอกเหตุผลในการสมัคร';
    if (!formData.email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (!formData.birthDate) newErrors.birthDate = 'กรุณาเลือกวันเกิด';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'กรุณากรอกหมายเลขโทรศัพท์ผู้ปกครอง';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle input changes - ใช้ useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle image upload - ใช้ useCallback
  const handleImageUpload = useCallback((e, type) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, profileImage: event.target.result }));
        } else {
          setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], { id: Date.now() + Math.random(), url: event.target.result, name: file.name }]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Remove image - ใช้ useCallback
  const removeImage = useCallback((type, imageId) => {
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, profileImage: null }));
    } else {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter(img => img.id !== imageId)
      }));
    }
  }, []);

  // Submit form - ใช้ useCallback
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) {
      const newStudent = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toLocaleString('th-TH')
      };
      setStudents(prev => [...prev, newStudent]);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        school: '',
        gpa: '',
        specialSkills: '',
        applicationReason: '',
        email: '',
        birthDate: '',
        parentPhone: '',
        profileImage: null,
        activityImages: [],
        awardImages: [],
        portfolioImages: []
      });
      
      alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
    }
  }, [formData, validateForm]);

  // Sort students - ใช้ useCallback
  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      let direction = 'asc';
      if (prev.key === key && prev.direction === 'asc') {
        direction = 'desc';
      }
      return { key, direction };
    });
  }, []);

  // Sorted students - ใช้ useMemo
  const sortedStudents = useMemo(() => {
    if (!sortConfig.key) return students;
    
    return [...students].sort((a, b) => {
      if (sortConfig.key === 'gpa') {
        return sortConfig.direction === 'asc' 
          ? parseFloat(a.gpa) - parseFloat(b.gpa)
          : parseFloat(b.gpa) - parseFloat(a.gpa);
      }
      
      const aValue = a[sortConfig.key].toString().toLowerCase();
      const bValue = b[sortConfig.key].toString().toLowerCase();
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortConfig]);

  // Render sort icon - ใช้ useCallback
  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  }, [sortConfig]);

  // Student form component - ใช้ React.memo เพื่อป้องกัน re-render ที่ไม่จำเป็น
  const StudentForm = React.memo(function StudentForm() {
    return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">แบบฟอร์มสมัคร TCAS69</h1>
        <p className="text-gray-600">กรอกข้อมูลส่วนตัวและ Portfolio ของคุณ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">รูปโปรไฟล์</label>
          <div className="flex flex-col items-center">
            {formData.profileImage ? (
              <div className="relative">
                <img src={formData.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-200" />
                <button type="button" onClick={() => removeImage('profile')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">×</button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'profile')}
              className="mt-2 text-sm text-gray-500"
              id="profile-upload"
            />
            <label htmlFor="profile-upload" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              เลือกรูปภาพ
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="กรอกชื่อ"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="กรอกนามสกุล"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">วันเกิด *</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่ *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="กรอกที่อยู่ที่สามารถติดต่อได้"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">หมายเลขโทรศัพท์ *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0812345678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">หมายเลขโทรศัพท์ผู้ปกครอง *</label>
            <input
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.parentPhone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0812345678"
            />
            {errors.parentPhone && <p className="text-red-500 text-sm mt-1">{errors.parentPhone}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">โรงเรียน *</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.school ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ชื่อโรงเรียนปัจจุบัน"
            />
            {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">เกรดเฉลี่ย (GPA) *</label>
            <input
              type="number"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              min="0"
              max="4"
              step="0.01"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.gpa ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="3.50"
            />
            {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ความสามารถพิเศษ *</label>
          <textarea
            name="specialSkills"
            value={formData.specialSkills}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.specialSkills ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="เช่น การเขียนโปรแกรม, ดนตรี, กีฬา, ศิลปะ, ฯลฯ"
          />
          {errors.specialSkills && <p className="text-red-500 text-sm mt-1">{errors.specialSkills}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เหตุผลในการสมัครเข้าเรียน *</label>
          <textarea
            name="applicationReason"
            value={formData.applicationReason}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${errors.applicationReason ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="อธิบายเหตุผลที่ต้องการเข้าเรียนในสาขานี้"
          />
          {errors.applicationReason && <p className="text-red-500 text-sm mt-1">{errors.applicationReason}</p>}
        </div>

        {/* Image Upload Sections */}
        {['activityImages', 'awardImages', 'portfolioImages'].map((type) => {
          const labels = {
            activityImages: 'รูปภาพกิจกรรม',
            awardImages: 'รูปภาพรางวัล',
            portfolioImages: 'รูปภาพผลงาน'
          };
          
          return (
            <div key={type}>
              <label className="block text-sm font-medium text-gray-700 mb-4">{labels[type]}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, type)}
                    className="hidden"
                    id={`${type}-upload`}
                  />
                  <label
                    htmlFor={`${type}-upload`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    เลือกรูปภาพ
                  </label>
                  <p className="text-gray-500 text-sm mt-2">สามารถเลือกได้หลายไฟล์</p>
                </div>
                
                {formData[type].length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData[type].map((image) => (
                      <div key={image.id} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(type, image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          ส่งใบสมัคร
        </button>
      </form>
    </div>
  );
  });

  // Teacher Dashboard - ใช้ React.memo
  const TeacherDashboard = React.memo(function TeacherDashboard() {
    return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">แดชบอร์ดอาจารย์</h2>
              <p className="text-gray-600">จัดการข้อมูลนักศึกษาที่สมัครเข้าเรียน</p>
            </div>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-600 font-semibold">ทั้งหมด {students.length} คน</span>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">ยังไม่มีข้อมูลนักศึกษา</h3>
            <p className="text-gray-400">เมื่อมีนักศึกษาส่งใบสมัคร ข้อมูลจะปรากฏที่นี่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left border-b border-gray-200">รูป</th>
                  <th 
                    className="px-6 py-4 text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('firstName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>ชื่อ-นามสกุล</span>
                      {renderSortIcon('firstName')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('school')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>โรงเรียน</span>
                      {renderSortIcon('school')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('gpa')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>GPA</span>
                      {renderSortIcon('gpa')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-200">วันที่ส่ง</th>
                  <th className="px-6 py-4 text-center border-b border-gray-200">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr key={student.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4 border-b border-gray-100">
                    {student.profileImage ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={student.profileImage}
    alt="Profile"
    className="w-12 h-12 rounded-full object-cover"
  />
) : (
  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
    <User className="w-6 h-6 text-gray-400" />
  </div>
)}

                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="font-semibold text-gray-800">{student.firstName} {student.lastName}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <School className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{student.school}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.gpa >= 3.5 ? 'bg-green-100 text-green-800' :
                        student.gpa >= 3.0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.gpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">
                      {student.submittedAt}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100 text-center">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <Eye className="w-4 h-4" />
                        <span>ดูรายละเอียด</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  ));

  // Student Detail Modal
  const StudentDetail = React.memo(() => {
    if (!selectedStudent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">รายละเอียดนักศึกษา</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-shrink-0">
                {selectedStudent.profileImage ? (
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedStudent.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-200" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">โทรศัพท์:</span>
                    <span className="font-semibold">{selectedStudent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <School className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">โรงเรียน:</span>
                    <span className="font-semibold">{selectedStudent.school}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600">GPA:</span>
                    <span className="font-semibold text-lg">{selectedStudent.gpa}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">วันเกิด:</span>
                    <span className="font-semibold">{new Date(selectedStudent.birthDate).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">อีเมล</label>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedStudent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">โทรศัพท์ผู้ปกครอง</label>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedStudent.parentPhone}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>ที่อยู่</span>
              </label>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg leading-relaxed">{selectedStudent.address}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">ความสามารถพิเศษ</label>
              <p className="text-gray-800 bg-blue-50 p-4 rounded-lg leading-relaxed">{selectedStudent.specialSkills}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">เหตุผลในการสมัครเข้าเรียน</label>
              <p className="text-gray-800 bg-green-50 p-4 rounded-lg leading-relaxed">{selectedStudent.applicationReason}</p>
            </div>

            {/* Image Galleries */}
            {['activityImages', 'awardImages', 'portfolioImages'].map((type) => {
              const labels = {
                activityImages: { title: 'รูปภาพกิจกรรม', icon: '🎯', color: 'blue' },
                awardImages: { title: 'รูปภาพรางวัล', icon: '🏆', color: 'yellow' },
                portfolioImages: { title: 'รูปภาพผลงาน', icon: '💼', color: 'purple' }
              };
              
              if (selectedStudent[type].length === 0) return null;
              
              return (
                <div key={type} className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <span className="text-lg">{labels[type].icon}</span>
                    <span>{labels[type].title}</span>
                    <span className={`bg-${labels[type].color}-100 text-${labels[type].color}-600 px-2 py-1 rounded-full text-xs`}>
                      {selectedStudent[type].length} รูป
                    </span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {selectedStudent[type].map((image, index) => (
                      <div key={image.id} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={`${labels[type].title} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                            modal.innerHTML = `
                              <div class="relative max-w-4xl max-h-full">
                                <img src="${image.url}" alt="${labels[type].title}" class="max-w-full max-h-full object-contain rounded-lg">
                                <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75" onclick="this.parentElement.parentElement.remove()">×</button>
                              </div>
                            `;
                            document.body.appendChild(modal);
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-sm">ส่งใบสมัครเมื่อ: {selectedStudent.submittedAt}</p>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">TCAS69 Portfolio System</h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('form')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'form' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                แบบฟอร์มสมัคร
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'dashboard' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                แดชบอร์ดอาจารย์
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'form' && <StudentForm />}
        {currentView === 'dashboard' && <TeacherDashboard />}
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && <StudentDetail />}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-lg font-semibold">TCAS69 Portfolio System</span>
          </div>
          <p className="text-gray-400">ระบบจัดการข้อมูลการสมัครเรียน พร้อมการจัดเก็บ Portfolio และการตรวจสอบข้อมูล</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-400">
            <span>✓ ตรวจสอบข้อมูลอัตโนมัติ</span>
            <span>✓ อัพโหลดรูปภาพได้</span>
            <span>✓ เรียงลำดับข้อมูลได้</span>
            <span>✓ ดูรายละเอียดแบบ Modal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TCAS69Portfolio;