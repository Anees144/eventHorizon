
'use client';

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { categories } from "@/lib/data"
import { useUser } from "@/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading profile...</p>
        </div>
    )
  }

  return (
    <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                        Update your personal information and profile picture.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button size="sm">Change</Button>
                                <Button size="sm" variant="outline">Remove</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={user.displayName || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email || ''} readOnly />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save Profile</Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                        Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">Save Password</Button>
                    </CardFooter>
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
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox id={category.toLowerCase()} defaultChecked={false} />
                                <label
                                    htmlFor={category.toLowerCase()}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {category}
                                </label>
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter>
                        <Button>Save Interests</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  )
}
