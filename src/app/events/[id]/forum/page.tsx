
'use client';

import { useEffect, useState, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { SendHorizonal, ArrowLeft } from 'lucide-react';
import { useCollection, useFirebase, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { events } from '@/lib/data';
import { MainHeader } from '@/components/layout/main-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

type ForumMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: any;
  senderName?: string;
  senderAvatar?: string;
};

export default function ForumPage() {
  const params = useParams();
  const eventId = params.id as string;
  const event = events.find((e) => e.id === eventId);
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesQuery = firestore ? query(
      collection(firestore, `events/${eventId}/forums/general/messages`),
      orderBy('timestamp', 'asc')
    ) : null;

  const { data: messages, isLoading: messagesLoading } = useCollection<ForumMessage>(messagesQuery);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !firestore) return;

    await addDoc(collection(firestore, `events/${eventId}/forums/general/messages`), {
      senderId: user.uid,
      content: newMessage,
      timestamp: serverTimestamp(),
      senderName: user.isAnonymous ? 'Anonymous User' : user.displayName || 'User',
      senderAvatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`
    });

    setNewMessage('');
  };

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-4xl">
            <CardHeader className="flex flex-row items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/events/${eventId}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <p className="text-sm text-muted-foreground">Forum for</p>
                <CardTitle className="font-headline text-2xl">{event.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messagesLoading && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-48" />
                    </div>
                  </div>
                   <div className="flex items-start gap-3 justify-end">
                    <div className="space-y-2 text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                      <Skeleton className="h-8 w-48 ml-auto" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </div>
              )}
              {!messagesLoading && messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.senderId === user?.uid ? 'justify-end' : ''}`}
                >
                  {msg.senderId !== user?.uid && (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={msg.senderAvatar} />
                      <AvatarFallback>{msg.senderName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg p-3 max-w-md ${
                      msg.senderId === user?.uid
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                    <p className="text-sm font-bold">{msg.senderName || 'Anonymous'}</p>
                    <p>{msg.content}</p>
                  </div>
                   {msg.senderId === user?.uid && (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={msg.senderAvatar} />
                      <AvatarFallback>{msg.senderName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isUserLoading}
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim() || isUserLoading}>
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
