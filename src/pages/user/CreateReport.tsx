
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MapComponent from '@/components/map/MapComponent';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(3, "Location must be at least 3 characters").max(200),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mediaFiles: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return Array.from(files).every(
          (file: any) => file.size <= MAX_FILE_SIZE
        );
      },
      `Max file size is 5MB`
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return Array.from(files).every((file: any) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
      },
      "Only .jpg, .jpeg, and .png formats are supported"
    ),
});

type FormValues = z.infer<typeof formSchema>;

const CreateReport = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!userData?.uid) {
      toast.error('You must be logged in to submit a report');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Upload media files if any
      const mediaUrls = [];
      
      if (data.mediaFiles && data.mediaFiles.length > 0) {
        const files = Array.from(data.mediaFiles);
        let completed = 0;
        
        for (const file of files) {
          const fileRef = ref(storage, `reports/${userData.uid}/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(fileRef);
          mediaUrls.push(downloadUrl);
          
          completed++;
          setUploadProgress(Math.round((completed / files.length) * 100));
        }
      }
      
      // Create report document
      const reportData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        coordinates: coordinates ? { lat: coordinates[1], lng: coordinates[0] } : null,
        mediaUrls,
        status: 'pending',
        userId: userData.uid,
        userEmail: userData.email,
        userName: userData.displayName || userData.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // In a real app, we'd assign to the nearest police station
        assignedStationId: 'demo-station',
        assignedStationName: 'Demo Police Station'
      };
      
      const docRef = await addDoc(collection(db, 'reports'), reportData);
      
      toast.success('Report submitted successfully');
      navigate(`/u/reports/${docRef.id}`);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setDetectionError('Geolocation is not supported by your browser');
      return;
    }

    setDetectionError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([longitude, latitude]);
        setLocationDetected(true);
        
        // Update form values
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);
        
        // For a real app, we would use reverse geocoding to get the address
        form.setValue('location', `Location detected at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        
        toast.success('Location detected successfully');
      },
      (error) => {
        console.error('Error getting location:', error);
        setDetectionError('Failed to detect location. Please enter address manually.');
        toast.error('Could not detect your location');
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">File a Report</h1>
          <p className="text-muted-foreground">
            Provide details about the incident to submit a report
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief title describing the incident" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a clear, concise title for your report
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="assault">Assault</SelectItem>
                          <SelectItem value="fraud">Fraud</SelectItem>
                          <SelectItem value="cybercrime">Cybercrime</SelectItem>
                          <SelectItem value="vandalism">Vandalism</SelectItem>
                          <SelectItem value="robbery">Robbery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the category that best describes the incident
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Address or description of location" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={detectLocation}
                          disabled={locationDetected}
                        >
                          {locationDetected ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormDescription>
                        Enter the location or use auto-detect
                      </FormDescription>
                      <FormMessage />
                      {detectionError && (
                        <p className="text-sm font-medium text-destructive">{detectionError}</p>
                      )}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the incident" 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide as many details as possible about what happened
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mediaFiles"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Evidence (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          onChange={(e) => onChange(e.target.files)}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload photos related to the incident (max 5MB each)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="font-semibold flex items-center">
                        <MapPin className="mr-2 h-5 w-5" /> Location Preview
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {locationDetected
                          ? "Your location has been detected. You can adjust it on the map."
                          : "Click 'Detect Location' button to automatically detect your location."}
                      </p>
                    </div>
                    
                    <div className="h-[300px] rounded-md overflow-hidden border">
                      <MapComponent 
                        locations={coordinates ? [
                          {
                            id: 1,
                            lat: coordinates[1],
                            lng: coordinates[0],
                            title: "Incident Location"
                          }
                        ] : []}
                        center={coordinates || undefined}
                        zoom={coordinates ? 15 : 4}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Filing a false police report is a criminal offense. Please ensure all information provided is accurate and truthful.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Submitting...'}
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/u/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default CreateReport;
