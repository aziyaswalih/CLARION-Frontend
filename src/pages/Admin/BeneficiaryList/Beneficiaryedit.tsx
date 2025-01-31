import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import Header from '../../../components/beneficiary/Header/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams hook

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const EditBeneficiary: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
  });
  const { id } = useParams<{ id: string }>(); // Get the `id` from the URL params

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/beneficiary/edit/${id}`);
        const user = response.data.beneficiary;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Username is required.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'A valid 10-digit phone number is required.';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Please select a role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: undefined });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
    setErrors({ ...errors, role: undefined });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put<{success:boolean, message: string }>(
        `http://localhost:5000/api/admin/beneficiary/update/${id}`,
        formData
      );
      if(response.data.success){
        window.location.href = '/admin/beneficiaries'
      }
    //   alert(response.data.message);
    } catch (error: any) {
      console.error('Error during update:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#9f8b75] to-[#2c2520]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <form className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={handleRoleChange} value={formData.role}>
              <SelectTrigger className="w-full mt-1 bg-white border-2 border-gray-300">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-300 shadow-lg">
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="donor">Donor</SelectItem>
                <SelectItem value="user">Beneficiary</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          <Button className="w-full bg-gradient-to-br from-[#956d09] to-[#b8860b]">Update Details</Button>
        </form>
      </main>
    </div>
  );
};

export default EditBeneficiary;
