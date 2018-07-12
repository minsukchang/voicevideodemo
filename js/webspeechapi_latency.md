There is some kind of built in timeout, after which you will get the result even if there is no more input (seems to be around 5-10 seconds).

In this case you will get the final onresult event, as well as the onend event. You will have to call recognition.start() again if you wish to keep accepting input.

Also, if you set

recognition.interimResults = true;
you will get onresult events with non final results, and you can decide if you want to display them before you get the final ones.

The other option is to turn off continuous with

recognition.continuous = false;
you will get a result shortly after the input (audio) stopped. You will also get the onend event.
If you wish to continue the recognition you will have to call again

recognition.start();
in the onend event handler.
On a non HTTPS page, this will cause the permission bar to pop up again.

