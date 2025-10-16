
'use client';

import { useState, useEffect, Suspense } from "react";
import { useUser, useAuth, useFirestore, useMemoFirebase } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import type { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function ProfilePageContent() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);


  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  useEffect(() => {
    async function fetchUserProfile() {
        if (user) {
          setDisplayName(user.displayName || '');
          setPhotoURL(user.photoURL || '');
        }

        if(userProfileRef) {
            setIsLoadingProfile(true);
            const docSnap = await getDoc(userProfileRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setInterests(data.interests || []);
            }
            setIsLoadingProfile(false);
        } else if (!isUserLoading) {
          setIsLoadingProfile(false);
        }
    }
    fetchUserProfile();

  }, [user, userProfileRef, isUserLoading]);


  const handleInterestChange = (category: string, checked: boolean) => {
    setInterests(prev => 
      checked ? [...prev, category] : prev.filter(i => i !== category)
    );
  };
  
  const handleSaveProfile = async () => {
    if (!user || !auth || !firestore) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
              displayName,
              photoURL,
          });
      }

      // Update Firestore profile
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        name: displayName,
        email: user.email,
        interests: interests,
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const simulatePhotoChange = () => {
    const seed = Math.floor(Math.random() * 1000);
    setPhotoURL(`https://picsum.photos/seed/${seed}/150/150`);
  }


  if (isUserLoading || isLoadingProfile) {
    return (
        <div className="grid gap-6">
           <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="flex gap-2">
                                   <Skeleton className="h-9 w-20" />
                                   <Skeleton className="h-9 w-20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                         <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(categories.length)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
           </div>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Please log in to view your profile.</p>
        </div>
    )
  }

  return (
    <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                        This information will be displayed publicly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={photoURL || ''} alt={displayName || ''} />
                                <AvatarFallback>{displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={simulatePhotoChange}>Change</Button>
                                <Button size="sm" variant="outline" onClick={() => setPhotoURL('')}>Remove</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user.email || ''} readOnly disabled/>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Interests</CardTitle>
                        <CardDescription>
                        This helps us recommend events you'll love.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={category.toLowerCase()} 
                                    checked={interests.includes(category)}
                                    onCheckedChange={(checked) => handleInterestChange(category, !!checked)}
                                />
                                <label
                                    htmlFor={category.toLowerCase()}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {category}
                                </label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
         <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
        </div>
    </div>
  )
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfilePageContent />
        </Suspense>
    )
}
